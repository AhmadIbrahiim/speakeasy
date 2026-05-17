#!/usr/bin/env python3
"""
slop-guard.py — PreToolUse hook that blocks AI-slop patterns from landing
in source code and docs.

What it blocks (hard fail, exit 2):
  1. The em-dash character (U+2014) in code files. Allowed in markdown.
  2. AI vocabulary words listed below — these are the giveaways that
     a model is writing "consultant prose" instead of builder prose.
  3. Hype phrases like "industry-leading", "best-in-class", "seamlessly".

What it does NOT do:
  - Parse semantics. It's a string scanner. Comments, docstrings, and
    user-facing strings are all treated alike.
  - Run on Read-only tools (Bash, Grep, etc).
  - Run on .md files (markdown blog content uses em-dashes legitimately).

Input contract: Claude Code PreToolUse hooks receive a JSON object on
stdin with `tool_name` and `tool_input`. We extract the proposed
content from Write/Edit/MultiEdit and scan it. Anything else is allowed.

Exit codes:
  0  allow
  2  block; stderr is shown back to Claude as a tool error

Scope override:
  Set HOOK_SLOP_GUARD_OFF=1 in the environment to bypass the guard
  (escape hatch for the rare legit em-dash in source — should be rare).
"""
from __future__ import annotations
import json
import os
import re
import sys

# -----------------------------------------------------------------------------
# Patterns
# -----------------------------------------------------------------------------

# AI vocabulary — match as whole words, case-insensitive. These are the
# words the project's CLAUDE.md explicitly bans in the gstack voice.
AI_VOCAB = {
    "delve", "crucial", "robust", "comprehensive", "nuanced",
    "multifaceted", "furthermore", "moreover", "additionally",
    "pivotal", "landscape", "tapestry", "underscore", "foster",
    "showcase", "intricate", "vibrant", "fundamental",
}
# "significant" was on the list but produces too many false positives
# (e.g. "statistically significant" in test code). Kept out of the block
# list but you can re-add if it bites.

HYPE_PHRASES = [
    r"industry[- ]leading",
    r"best[- ]in[- ]class",
    r"cutting[- ]edge",
    r"state[- ]of[- ]the[- ]art",
    r"seamlessly\b",
    r"leverages?\b",  # "leverage X to do Y" — classic consultant verb
    r"unlock(s|ed|ing)?\s+(value|potential|insights?)",
    r"empower(s|ed|ing)?\b",
]

# File extensions we treat as source code (em-dash blocked).
CODE_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".rb", ".go", ".rs", ".java", ".kt", ".swift",
    ".scss", ".sass", ".css", ".html",
    ".sh", ".bash", ".zsh",
    ".yml", ".yaml", ".toml", ".json",
}
# .md, .mdx, .txt, .rst — em-dashes allowed; AI vocab still blocked.

# Tools whose content we should scan.
WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

def extract_content(tool_name: str, tool_input: dict) -> str:
    """Pull the about-to-be-written text out of the tool input."""
    if tool_name == "Write":
        return tool_input.get("content", "") or ""
    if tool_name == "Edit":
        return tool_input.get("new_string", "") or ""
    if tool_name == "MultiEdit":
        edits = tool_input.get("edits", []) or []
        return "\n".join((e or {}).get("new_string", "") for e in edits)
    if tool_name == "NotebookEdit":
        return tool_input.get("new_source", "") or ""
    return ""


def file_ext(path: str) -> str:
    if not path:
        return ""
    _, ext = os.path.splitext(path)
    return ext.lower()


def find_em_dashes(text: str) -> list[int]:
    """Return line numbers (1-indexed) containing an em-dash."""
    return [i + 1 for i, line in enumerate(text.splitlines()) if "—" in line]


def find_ai_vocab(text: str) -> dict[str, list[int]]:
    """Return {word: [line_numbers]} for matched banned vocabulary."""
    hits: dict[str, list[int]] = {}
    for i, line in enumerate(text.splitlines(), start=1):
        for w in AI_VOCAB:
            if re.search(rf"\b{re.escape(w)}\b", line, re.IGNORECASE):
                hits.setdefault(w, []).append(i)
    return hits


def find_hype(text: str) -> dict[str, list[int]]:
    hits: dict[str, list[int]] = {}
    for i, line in enumerate(text.splitlines(), start=1):
        for pattern in HYPE_PHRASES:
            if re.search(pattern, line, re.IGNORECASE):
                hits.setdefault(pattern, []).append(i)
    return hits


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

def main() -> int:
    if os.environ.get("HOOK_SLOP_GUARD_OFF") == "1":
        return 0

    try:
        payload = json.load(sys.stdin)
    except Exception:
        # If we can't read the payload, fail open. Hooks must not break
        # normal flow on malformed input.
        return 0

    tool_name = payload.get("tool_name", "")
    if tool_name not in WRITE_TOOLS:
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")
    ext = file_ext(file_path)
    content = extract_content(tool_name, tool_input)
    if not content:
        return 0

    violations: list[str] = []

    # 1) Em-dashes (code files only — markdown gets a pass).
    if ext in CODE_EXTS:
        em = find_em_dashes(content)
        if em:
            preview = ", ".join(f"L{n}" for n in em[:5])
            extra = f" (+{len(em) - 5} more)" if len(em) > 5 else ""
            violations.append(
                f"em-dash (\\u2014) found at {preview}{extra}. Use a regular "
                f"hyphen or rephrase. The project's voice rules forbid em-dashes "
                f"in source files."
            )

    # 2) AI vocabulary (always).
    vocab = find_ai_vocab(content)
    if vocab:
        items = []
        for word, lines in sorted(vocab.items()):
            preview = ", ".join(f"L{n}" for n in lines[:3])
            extra = f" +{len(lines) - 3}" if len(lines) > 3 else ""
            items.append(f"\"{word}\" at {preview}{extra}")
        violations.append(
            "AI vocabulary detected: " + "; ".join(items) + ". These words "
            "signal consultant prose. Rewrite with plain English — say what "
            "the thing does and why it matters."
        )

    # 3) Hype phrases (always).
    hype = find_hype(content)
    if hype:
        items = [f"/{p}/ at L{lines[0]}" for p, lines in hype.items()]
        violations.append(
            "Hype phrase(s) detected: " + ", ".join(items) + ". Replace with "
            "a concrete claim. \"Seamlessly\" never adds information."
        )

    if violations:
        sys.stderr.write("[slop-guard] BLOCKED\n\n")
        for v in violations:
            sys.stderr.write(f"  - {v}\n")
        sys.stderr.write(
            "\nSet HOOK_SLOP_GUARD_OFF=1 to bypass for one session if you "
            "have a real reason. The guard exists because the project's "
            "voice rules in CLAUDE.md ban this language.\n"
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
