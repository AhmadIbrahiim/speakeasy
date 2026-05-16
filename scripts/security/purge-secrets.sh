#!/usr/bin/env bash
#
# purge-secrets.sh — rewrite git history to remove leaked secrets.
#
# This script is intended to be run BY AN OPERATOR after the steps in
# docs/security/history-rewrite-checklist.md have been completed. It will
# refuse to run on a dirty tree or against a stale main branch. It does NOT
# push — that is a deliberate, separate operator action.
#
# Usage:
#   scripts/security/purge-secrets.sh [--dry-run]

set -euo pipefail

# Resolve repo root from the script location so the operator can invoke from anywhere.
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../.." >/dev/null 2>&1 && pwd)"
REPLACEMENTS_FILE="$SCRIPT_DIR/leaked-strings.txt"

DRY_RUN=0
for arg in "$@"; do
    case "$arg" in
        --dry-run)
            DRY_RUN=1
            ;;
        -h|--help)
            grep '^#' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "Unknown argument: $arg" >&2
            echo "Usage: $0 [--dry-run]" >&2
            exit 2
            ;;
    esac
done

cd "$REPO_ROOT"

# --- Safety check 1: must be inside a git repo ----------------------------------
if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "ERROR: $REPO_ROOT is not a git repository." >&2
    exit 1
fi

# --- Safety check 2: working tree must be clean --------------------------------
git diff --quiet && git diff --cached --quiet || { echo "Working tree dirty"; exit 1; }

# --- Safety check 3: must be on main and in sync with origin/main --------------
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo "ERROR: must run on 'main' (currently on '$CURRENT_BRANCH')." >&2
    exit 1
fi

echo "Fetching origin/main to verify HEAD is current..."
git fetch origin main

LOCAL_TIP="$(git rev-parse refs/heads/main)"
REMOTE_TIP="$(git rev-parse refs/remotes/origin/main)"
if [[ "$LOCAL_TIP" != "$REMOTE_TIP" ]]; then
    echo "ERROR: local main ($LOCAL_TIP) is not at origin/main ($REMOTE_TIP)." >&2
    echo "Pull or reset before re-running so the rewrite starts from the latest tip." >&2
    exit 1
fi

# --- Safety check 4: git-filter-repo must be installed -------------------------
if ! command -v git-filter-repo >/dev/null 2>&1; then
    echo "ERROR: git-filter-repo is not installed." >&2
    echo "  Install with: brew install git-filter-repo" >&2
    echo "           or: pip install git-filter-repo" >&2
    exit 1
fi

# --- Safety check 5: replacements file exists ----------------------------------
if [[ ! -f "$REPLACEMENTS_FILE" ]]; then
    echo "ERROR: replacements file missing at $REPLACEMENTS_FILE." >&2
    exit 1
fi

# --- Safety check 6: confirm a backup mirror exists ---------------------------
# The checklist instructs the operator to make a mirror at
# ../voicemail-greeting-backup-YYYYMMDD. We don't fail on this — the operator
# may have used a different name — but we warn loudly.
if ! ls -1d ../voicemail-greeting-backup-* >/dev/null 2>&1; then
    echo "WARNING: no '../voicemail-greeting-backup-*' mirror found." >&2
    echo "         The checklist requires a backup mirror before rewriting history." >&2
    echo "         Continue only if you took a backup under a different name." >&2
    read -r -p "Type 'yes' to continue without an obvious backup: " confirm
    if [[ "$confirm" != "yes" ]]; then
        echo "Aborted." >&2
        exit 1
    fi
fi

EXTRA_FLAGS=()
if [[ "$DRY_RUN" -eq 1 ]]; then
    EXTRA_FLAGS+=(--dry-run)
    echo ""
    echo "=== DRY RUN — no refs will be rewritten ==="
fi

echo ""
echo "Step 1/2: stripping .env from all history..."
git filter-repo --force --invert-paths --path .env "${EXTRA_FLAGS[@]}"

echo ""
echo "Step 2/2: replacing leaked tokens via $REPLACEMENTS_FILE..."
git filter-repo --force --replace-text "$REPLACEMENTS_FILE" "${EXTRA_FLAGS[@]}"

echo ""
if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "Dry run complete. Re-run without --dry-run to perform the rewrite."
else
    echo "History rewrite complete."
    echo ""
    echo "DO NOT push yet — verify with 'gitleaks detect --source . --no-banner' first,"
    echo "then 'git push --force-with-lease origin main' per the checklist."
fi
