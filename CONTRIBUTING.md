# Contributing

## Welcome

Thanks for your interest in improving voicemail-greeting. This project is a small Next.js app for generating voicemail greetings, and we welcome bug reports, fixes, and well-scoped feature contributions.

## Setup

Requirements: Node 18+ and npm.

```bash
git clone https://github.com/AhmadIbrahiim/voicemail-greeting.git
cd voicemail-greeting
npm install
cp .env.example .env
npm run dev
```

The dev server runs at http://localhost:3000.

## Project layout

- `src/app/` — Next.js app router pages, layouts, and route handlers.
- `src/components/` — Reusable React components (including the main voicemail flow).
- `src/app/server/lib/` — Server-only utilities (audio pipeline, provider clients, helpers).
- `src/posts/` — Markdown content for static pages.
- `scripts/` — Build-time and maintenance scripts (content pipeline, audio generation, etc.).
- `docs/` — Project documentation.

## Before opening a PR

All of the following must pass locally:

- `npx tsc --noEmit` — TypeScript type check passes with no errors.
- `npm test` — All unit tests pass.
- `npm run lint` — ESLint passes with no warnings or errors.
- `gitleaks detect --source .` — If `gitleaks` is installed, the scan must report no leaks. (Install via `brew install gitleaks` on macOS.)

If you touch anything that changes generated content or runtime behavior, include a brief note in your PR describing how you verified it manually.

## Commit style

Short, conventional-ish commits. Lowercase prefix, imperative tense, subject under 72 chars.

Allowed prefixes:

- `feat:` — new user-facing feature
- `fix:` — bug fix
- `chore:` — tooling, deps, build, non-functional cleanup
- `docs:` — documentation only
- `security:` — security-relevant change
- `refactor:` — internal restructure without behavior change

Examples:

```
feat: add background loop selector to greeting UI
fix: handle empty Cartesia response without crashing
security: validate background path to prevent traversal
```

## PR description

Every PR should answer three questions:

1. **What changed?** A short summary of the diff.
2. **Why?** The motivation — user need, bug report, follow-up, etc.
3. **How to verify?** Steps a reviewer can run to confirm the change works (commands, URLs, things to click).

Link any related issue with `Closes #N` when applicable.

## Code style

- Visual and UI conventions live in [DESIGN.md](DESIGN.md) — read it before adding components or restyling existing ones.
- Code style is enforced by ESLint; config lives at `.eslintrc.json`. Run `npm run lint` before pushing.
- Prefer existing utilities and components over creating new ones. Search before adding.

## Issue triage

**Bug reports** must include:

- Repro steps (minimal sequence to trigger the bug).
- Expected vs. actual behavior.
- Browser version (for client-side bugs) and Node version (for server-side bugs).
- Any relevant console output, network errors, or screenshots.

**Feature requests** must describe:

- The user need or use case driving the request.
- What you've tried or considered.
- Why the current behavior is insufficient.

Issues without enough detail to act on may be closed and asked to re-open with more information.

## Communication

- Open a GitHub issue for bugs, feature requests, or questions.
- For private inquiries or anything you can't share publicly, email `me@ahmed-ibrahim.com`.
- For security reports, see [SECURITY.md](SECURITY.md) — do not open a public issue.
