# `.claude/` — Claude Code project config

This directory holds project-scoped settings and hooks for [Claude Code](https://claude.com/claude-code) so any contributor working in the repo with Claude gets the same guardrails the maintainer uses. Nothing in here is required to develop the project — if you don't use Claude Code, ignore it.

## What's here

```
.claude/
├── settings.json       # registers the hooks below
└── hooks/
    ├── slop-guard.py       # blocks AI-slop language in Write/Edit
    └── kiss-dry-guard.py   # blocks empty catches, TODO stubs, premature abstraction
```

Hooks are `PreToolUse` — they run BEFORE the tool executes. If they exit 2, the tool call is blocked and the stderr message is shown back to Claude as a tool error. If they exit 0, the call goes through (a non-empty stderr is shown as a soft warning).

## `slop-guard.py`

Hard-blocks three patterns from landing in the repo:

1. **Em-dash (`—`, U+2014) in source files.** The project's voice rules ban them (see [`CLAUDE.md`](../CLAUDE.md) → "No em dashes"). Markdown files (`*.md`) are exempt — blog posts use them legitimately.
2. **AI vocabulary words** as a whole-word, case-insensitive match: `delve`, `crucial`, `robust`, `comprehensive`, `nuanced`, `multifaceted`, `furthermore`, `moreover`, `additionally`, `pivotal`, `landscape`, `tapestry`, `underscore`, `foster`, `showcase`, `intricate`, `vibrant`, `fundamental`. These are the giveaways that a model is writing consultant prose. Block + suggest plain English.
3. **Hype phrases**: `industry-leading`, `best-in-class`, `cutting-edge`, `seamlessly`, `leverage`, `unlock value`, `empower`. Replace with a concrete claim.

**Escape hatch:** set `HOOK_SLOP_GUARD_OFF=1` in the environment to bypass for one session. Should be rare — if you're reaching for em-dashes in code, the right fix is almost always to rephrase.

## `kiss-dry-guard.py`

Three hard blocks + one soft warning:

| Severity | Trigger | Reason |
| --- | --- | --- |
| Block | Empty `catch {}` / `except: pass` | Silent failures rot. Log, rethrow, or handle a specific case. |
| Block | `TODO:`, `FIXME:`, `XXX:` comments | If the work isn't done, open an issue instead of committing the placeholder. |
| Block | New `class FooManager` / `Factory` / `Helper` / `Utils` / `Wrapper` / `Handler` | Strong signal of premature abstraction. Inline behavior where it's used; extract only on the third repetition. |
| Warn  | New `Write` in `src/` with a basename that already exists under `src/` | You may be reinventing an existing utility. Soft warn — tool call still runs. |

**Escape hatch:** set `HOOK_KISS_DRY_OFF=1` to bypass. Almost always wrong to do so.

## Why hooks instead of CI?

Both. CI (`.github/workflows/ci.yml`) runs typecheck + lint + tests + secret scan on every push. Hooks fire at the moment of writing — they catch the slop BEFORE it lands in a commit, which is cheaper for everyone. CI is the safety net; hooks are the editor experience.

## Adding a new hook

1. Drop a Python script in `hooks/`. It receives the Claude Code PreToolUse JSON payload on stdin (`tool_name`, `tool_input`, etc).
2. Make it executable: `chmod +x hooks/your-hook.py`.
3. Register it in `settings.json` under the appropriate matcher.
4. Smoke-test from the shell:

   ```bash
   echo '{"tool_name":"Write","tool_input":{"file_path":"/x.ts","content":"..."}}' | python3 .claude/hooks/your-hook.py
   echo "exit=$?"
   ```

Exit `0` to allow (stderr shown as soft warning), exit `2` to block (stderr shown as tool error).

## Testing the hooks

Both hooks are pure functions of the input JSON — no side effects, no file reads beyond the optional duplicate-basename check. To run the full smoke suite:

```bash
.claude/hooks/slop-guard.py < <(echo '{"tool_name":"Write","tool_input":{"file_path":"/x.ts","content":"// hello — world"}}')
# exit 2: em-dash blocked

.claude/hooks/kiss-dry-guard.py < <(echo '{"tool_name":"Write","tool_input":{"file_path":"/x.ts","content":"try { x() } catch {}"}}')
# exit 2: empty catch blocked
```

If you change the rule list, re-run the smoke tests before committing the change.
