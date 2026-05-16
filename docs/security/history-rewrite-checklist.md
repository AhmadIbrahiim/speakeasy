# History Rewrite Checklist

This playbook removes leaked secrets from the git history of `voicemail-greeting`
using [`git-filter-repo`](https://github.com/newren/git-filter-repo). Once
executed, every collaborator must re-sync because all commit SHAs after the
earliest leaked commit will change.

> **This is destructive.** Read the entire document — including the Rollback
> section — before running anything.

The tooling referenced by this checklist:

- `scripts/security/purge-secrets.sh` — orchestrates the rewrite.
- `scripts/security/leaked-strings.txt` — the `--replace-text` rules.
- `docs/security/secret-rotation-runbook.md` — sister doc covering key rotation.

## Preconditions

All of the following MUST be true before starting. Do not skip any item.

1. **All 4 keys rotated.** Each leaked credential — the Vercel Blob token, the
   four ElevenLabs `sk_…` keys, and the Google Gemini `AIza…` key — has been
   rotated end-to-end per `docs/security/secret-rotation-runbook.md`. The old
   values are dead at the provider; rewriting history does not invalidate live
   keys.
2. **All collaborators notified.** Every contributor with a clone has been
   warned about the upcoming force-push, the approximate window, and the
   recovery steps from Step 6 below.
3. **CI is green on HEAD.** `main` is passing all required checks. We do not
   want a rewrite landing on top of an already-broken build.
4. **Backup mirror taken.** From the repo root:

   ```bash
   git clone --mirror . "../voicemail-greeting-backup-$(date +%Y%m%d)"
   ```

   Confirm the directory exists and is non-empty before proceeding. This is
   your only escape hatch (see Rollback).

## Step 1 — Install `git-filter-repo`

Pick one:

```bash
brew install git-filter-repo
# or
pip install git-filter-repo
```

Verify:

```bash
git filter-repo --version
```

## Step 2 — Dry run

From the repo root:

```bash
./scripts/security/purge-secrets.sh --dry-run
```

Review the output. `git-filter-repo` will report which commits and blobs it
would touch but will not modify any refs. If anything looks unexpected (e.g.
unrelated files flagged for rewrite), stop and investigate before continuing.

## Step 3 — Execute the rewrite

```bash
./scripts/security/purge-secrets.sh
```

The script:

1. Refuses to run if the working tree is dirty, the current branch is not
   `main`, local `main` is behind `origin/main`, or `git-filter-repo` is
   missing.
2. Removes `.env` from every commit (`git filter-repo --invert-paths --path .env`).
3. Replaces all leaked tokens listed in `scripts/security/leaked-strings.txt`
   with `<REDACTED_*>` markers (`git filter-repo --replace-text …`).

When it finishes, the local repository is rewritten but nothing has been
pushed yet.

## Step 4 — Verify locally

Run `gitleaks` across all history (not just HEAD):

```bash
gitleaks detect --source . --no-banner
```

Expected outcome: **zero findings**. If anything is reported, do NOT push.
Investigate the finding, add the pattern to
`scripts/security/leaked-strings.txt`, restore from the backup mirror (see
Rollback), and re-run from Step 2.

## Step 5 — Force-push

Only after Step 4 reports zero findings:

```bash
git push --force-with-lease origin main
```

### Other branches that need re-syncing

`git-filter-repo` rewrites every ref in the repository, so any local branches
based on the old `main` will be detached. After the push, re-sync each active
feature branch:

```bash
git checkout <feature-branch>
git rebase origin/main   # or recreate the branch from the new main
git push --force-with-lease origin <feature-branch>
```

Coordinate with whoever owns the branch before force-pushing it. Stale PRs
should be closed and reopened against the rewritten history.

## Step 6 — Collaborator recovery

Each collaborator must do **one** of the following, in priority order:

1. **Recommended — reclone.** Simplest and safest:

   ```bash
   cd ..
   rm -rf voicemail-greeting
   git clone <repo-url> voicemail-greeting
   ```

2. **Reset existing clone.** Faster, but destroys uncommitted local work in the
   working tree — **stash first**:

   ```bash
   git stash push -u -m "pre-history-rewrite"
   git fetch origin
   git reset --hard origin/main
   # If you had a feature branch:
   git checkout <branch>
   git reset --hard origin/<branch>   # only if the branch was re-synced in Step 5
   git stash pop                       # only if needed; expect conflicts
   ```

   Warn collaborators explicitly: anything not pushed and not stashed will be
   lost when they `reset --hard`.

## Step 7 — Verify the remote is clean

After everyone has re-synced, run `gitleaks` one more time against a fresh
clone — this confirms GitHub itself is clean (the cached pre-rewrite views on
GitHub do persist briefly via PR/commit links, but the default branch and new
clones will be redacted):

```bash
cd /tmp
git clone <repo-url> voicemail-greeting-verify
cd voicemail-greeting-verify
gitleaks detect --source . --no-banner
```

Expected: zero findings. If GitHub still surfaces leaked SHAs via direct
links, contact GitHub Support to request cache invalidation; the commit
objects themselves will be unreachable after garbage collection.

## Rollback

If anything goes wrong before the force-push, recover from the backup mirror:

```bash
cd ..
rm -rf voicemail-greeting           # only your local clone
git clone voicemail-greeting-backup-YYYYMMDD voicemail-greeting
cd voicemail-greeting
git remote set-url origin <repo-url>
```

If you have already pushed and need to undo it, the backup mirror still has
every original ref:

```bash
cd voicemail-greeting-backup-YYYYMMDD
git push --force origin 'refs/heads/*'
git push --force origin 'refs/tags/*'
```

This restores the remote to its pre-rewrite state. The leaked credentials are
back in history — which is why **Preconditions step 1 (rotation) is
non-negotiable**: even a rollback must leave no live secret exposed.
