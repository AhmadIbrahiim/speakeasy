# Local secret scanning

CI runs [gitleaks](https://github.com/gitleaks/gitleaks) against every push and
pull request via `.github/workflows/ci.yml`. Catching secrets locally — before
they hit the remote — is faster and cheaper than waiting for CI to fail.

## Install

Pick one:

```bash
# macOS (recommended)
brew install gitleaks

# Anywhere with Docker
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest \
  detect --source /repo --config /repo/.gitleaks.toml --verbose
```

## Run before committing

From the repository root:

```bash
gitleaks detect --source . --config .gitleaks.toml --verbose
```

A clean run exits `0` with `no leaks found`. If gitleaks reports a finding:

1. **Stop.** Do not commit.
2. Inspect the offending file and remove or replace the secret with a
   placeholder (`vercel_blob_rw_xxxxxxxxxx_yyyyyyyyyy`, `YOUR_API_KEY`, etc.).
3. If the secret was ever committed locally, even in an earlier draft commit
   on this branch, treat it as exposed and rotate the credential per the
   secret rotation runbook before reattempting the commit.
4. Re-run `gitleaks detect` to confirm zero findings.

## What the config covers

`.gitleaks.toml` extends the upstream default ruleset and adds custom rules
for the providers this project integrates with:

- `cartesia-api-key` — anything assigned to `CARTESIA_API_KEY=`
- `elevenlabs-api-key` — keys with the `sk_` prefix
- `vercel-blob-token` — `vercel_blob_rw_…` tokens
- `gemini-api-key` — Google `AIza…` keys

Documentation placeholders (`vercel_blob_rw_xxxxxxxxxx_yyyyyyyyyy`,
`YOUR_*_KEY`, etc.) and noisy paths (`node_modules`, `.next`, `output/`,
generated `.mp3` files, `.env.example`, `package-lock.json`) are allowlisted
so the scanner stays signal-heavy.
