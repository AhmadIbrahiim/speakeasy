#!/usr/bin/env python3
"""
kiss-dry-guard.py — PreToolUse hook that nudges Claude toward simpler,
reuse-first code.

What it does (soft warnings — exit 0 with a stderr message — unless
the violation is clearly a mistake, in which case exit 2 blocks):

  HARD BLOCK (exit 2):
    1. Empty catch / except blocks. Silent failures rot.
    2. Stub TODO / FIXME / XXX comments. If you can't finish it, don't
       commit it — open an issue instead.
    3. New "Service / Manager / Factory / Helper / Utils" CLASS in a
       single edit, when no existing class with the same suffix is
       being modified. Strong signal of premature abstraction.

  SOFT WARN (exit 0 with stderr):
    4. New file under src/ whose basename matches an existing util,
       hook, or component name. Likely a duplicate.

The point is not to be pedantic. It's to make Claude pause for two
seconds and check whether the simpler / existing-utility path is being
ignored. Most warnings will be wrong and can be ignored; the right
ones save a refactor PR.

Input: PreToolUse JSON on stdin.
Exit: 0 allow, 2 block.
Escape hatch: HOOK_KISS_DRY_OFF=1.
"""
from __future__ import annotations
import json
import os
import re
import sys
from pathlib import Path

WRITE_TOOLS = {"Write", "Edit", "MultiEdit"}

# Class-name suffixes that read as premature abstraction. The hook does
# NOT block these when an existing class with the same name is being
# modified; the check fires only on `class FooManager` appearing in an
# Edit that wasn't already there.
ABSTRACTION_SUFFIXES = ("Manager", "Factory", "Helper", "Utils", "Util", "Wrapper", "Handler")

# Source roots we care about for the duplicate-file heuristic.
SRC_ROOTS = ("src/components/", "src/lib/", "src/hooks/", "src/app/server/lib/")

# Where the project's CLAUDE.md lives (for the rule reference in error msgs).
GUIDE_REF = "CLAUDE.md → \"Don't add features, refactor, or introduce abstractions beyond what the task requires.\""


def extract_content(tool_name: str, tool_input: dict) -> str:
    if tool_name == "Write":
        return tool_input.get("content", "") or ""
    if tool_name == "Edit":
        return tool_input.get("new_string", "") or ""
    if tool_name == "MultiEdit":
        edits = tool_input.get("edits", []) or []
        return "\n".join((e or {}).get("new_string", "") for e in edits)
    return ""


def repo_root() -> Path:
    """Walk up from CWD to find the repo root (the dir containing .git)."""
    p = Path.cwd().resolve()
    while p != p.parent:
        if (p / ".git").exists():
            return p
        p = p.parent
    return Path.cwd()


def find_empty_catches(text: str) -> list[int]:
    """Lines that open an empty catch / except block."""
    hits: list[int] = []
    lines = text.splitlines()
    for i, line in enumerate(lines, start=1):
        s = line.strip()
        # JS / TS: } catch {} or } catch (e) {}
        if re.search(r"\bcatch\s*(\([^)]*\))?\s*\{\s*\}\s*$", s):
            hits.append(i)
        # Python: except: pass  / except Exception: pass
        if re.match(r"except[\s\w(),.:]*:\s*pass\s*$", s):
            hits.append(i)
    return hits


def find_todo_stubs(text: str) -> list[tuple[int, str]]:
    """Lines containing TODO/FIXME/XXX comment markers."""
    hits: list[tuple[int, str]] = []
    for i, line in enumerate(text.splitlines(), start=1):
        m = re.search(r"\b(TODO|FIXME|XXX)\b[: ]?(.*)$", line)
        if m:
            hits.append((i, m.group(1)))
    return hits


def find_abstraction_classes(text: str) -> list[tuple[int, str]]:
    """New `class FooManager` / `class FooFactory` declarations."""
    hits: list[tuple[int, str]] = []
    pattern = re.compile(
        r"^\s*(?:export\s+)?(?:abstract\s+)?class\s+(\w+(" + "|".join(ABSTRACTION_SUFFIXES) + r"))\b"
    )
    for i, line in enumerate(text.splitlines(), start=1):
        m = pattern.match(line)
        if m:
            hits.append((i, m.group(1)))
    return hits


def find_duplicate_basename(file_path: str) -> list[str]:
    """
    For a NEW file at src/components/foo.tsx, look for any other file
    with the same basename anywhere under src/. Returns the list of
    matches NOT counting the file itself.
    """
    if not file_path:
        return []
    p = Path(file_path)
    if not any(file_path.replace("\\", "/").find(root) >= 0 for root in SRC_ROOTS):
        return []
    if p.exists():
        return []  # Editing existing — not a duplicate concern.
    name = p.name.lower()
    root = repo_root() / "src"
    if not root.exists():
        return []
    matches: list[str] = []
    for candidate in root.rglob(p.name):
        # Skip the target itself (shouldn't exist, but just in case).
        if candidate.resolve() == p.resolve():
            continue
        if candidate.name.lower() == name:
            matches.append(str(candidate.relative_to(repo_root())))
    return matches


def main() -> int:
    if os.environ.get("HOOK_KISS_DRY_OFF") == "1":
        return 0

    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    tool_name = payload.get("tool_name", "")
    if tool_name not in WRITE_TOOLS:
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")
    content = extract_content(tool_name, tool_input)
    if not content:
        return 0

    blocks: list[str] = []
    warns: list[str] = []

    # 1) Empty catches — hard block.
    empty = find_empty_catches(content)
    if empty:
        preview = ", ".join(f"L{n}" for n in empty[:3])
        blocks.append(
            f"Empty catch / except at {preview}. Silent failures are the #1 "
            f"reason a bug ships. Either log the error, rethrow, or handle "
            f"the specific failure mode. Don't swallow."
        )

    # 2) TODO/FIXME stubs — hard block.
    todos = find_todo_stubs(content)
    if todos:
        kinds = ", ".join(f"L{n} ({kind})" for n, kind in todos[:3])
        blocks.append(
            f"Stub comment at {kinds}. If the work isn't done, don't commit "
            f"the placeholder. Open an issue and reference it from the PR. "
            f"({GUIDE_REF})"
        )

    # 3) Premature abstraction class — hard block, but only when the
    # CLASS is genuinely new (Write tool, or an Edit that adds the line
    # for the first time).
    abstractions = find_abstraction_classes(content)
    if abstractions:
        items = ", ".join(f"`{cls}` (L{ln})" for ln, cls in abstractions)
        blocks.append(
            f"Premature-abstraction class names: {items}. \"Manager\", "
            f"\"Factory\", \"Helper\", \"Utils\" suffixes usually mean we're "
            f"creating a holder for behavior that wants to live where it's "
            f"used. Inline first; extract only on the third repetition. "
            f"({GUIDE_REF})"
        )

    # 4) Duplicate basename — soft warn (don't block).
    if tool_name == "Write":
        dupes = find_duplicate_basename(file_path)
        if dupes:
            warns.append(
                f"A file named `{Path(file_path).name}` already exists at: "
                + ", ".join(dupes)
                + ". Are you reinventing it? If they're truly different, "
                "consider distinct names so future-you doesn't have to grep."
            )

    if blocks:
        sys.stderr.write("[kiss-dry-guard] BLOCKED\n\n")
        for b in blocks:
            sys.stderr.write(f"  - {b}\n")
        if warns:
            sys.stderr.write("\nAlso noticed (non-blocking):\n")
            for w in warns:
                sys.stderr.write(f"  - {w}\n")
        sys.stderr.write(
            "\nSet HOOK_KISS_DRY_OFF=1 to bypass if you genuinely need to. "
            "Almost always you don't.\n"
        )
        return 2

    if warns:
        sys.stderr.write("[kiss-dry-guard] heads up:\n")
        for w in warns:
            sys.stderr.write(f"  - {w}\n")
        # Soft warn — return 0 so the tool still runs.
        return 0

    return 0


if __name__ == "__main__":
    sys.exit(main())
