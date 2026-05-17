# Perfect Greet documentation

The canonical entry points for users and contributors live at the repo root:

- [`README.md`](../README.md) — what the project is, quick start, deploy.
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — dev setup, CI gates, commit style.
- [`SECURITY.md`](../SECURITY.md) — vulnerability disclosure + threat model.
- [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — community standards.
- [`DESIGN.md`](../DESIGN.md) — visual design system (color, type, components, copy).
- [`.env.example`](../.env.example) — environment variable template.

This `docs/` tree holds longer-form reference material that doesn't belong at the root:

## `architecture/`

Background and design notes on specific subsystems.

- [`serverless-audio.md`](architecture/serverless-audio.md) — why audio mixing happens client-side via Crunker, why we don't ship ffmpeg in the request path, and the trade-offs that informed the decision.
- [`template-library.md`](architecture/template-library.md) — how the built-in voicemail templates work, where they live in code, and how to add more.

## `security/`

Operational runbooks for the security-sensitive corners of the project.

- [`secret-rotation-runbook.md`](security/secret-rotation-runbook.md) — per-provider key rotation procedure with revoke-before-reissue ordering.
- [`history-rewrite-checklist.md`](security/history-rewrite-checklist.md) — `git filter-repo` operator playbook for purging leaked secrets from history.
- [`local-secret-scan.md`](security/local-secret-scan.md) — installing and running `gitleaks` locally before committing.

## Auxiliary tooling

- [`../scripts/README.md`](../scripts/README.md) — optional content-authoring scripts (blog post generation, thumbnail rendering). **Not** required to develop or use the app.
