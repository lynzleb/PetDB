#!/bin/zsh
# One-shot: store your GitHub PAT and make it available to Kiro (and all apps)
# across every login session on macOS.
#
# Prerequisite: run scripts/env/install.sh once first (installs the LaunchAgent).
#
# Usage:  zsh scripts/env/setup-github-pat.sh
# It will:
#   1. Prompt you to paste your GitHub token (hidden, not saved to history)
#   2. Store it in a locked-down file (~/.config/petdb/github_pat, chmod 600)
#   3. Reload the LaunchAgent so the token is set now and at every future login
#   4. Show a masked confirmation
#
# After it finishes: fully quit Kiro (Cmd+Q) and reopen it.

set -e

CONFIG_DIR="$HOME/.config/petdb"
PAT_FILE="$CONFIG_DIR/github_pat"
PLIST="$HOME/Library/LaunchAgents/com.petdb.env.plist"

mkdir -p "$CONFIG_DIR"

echo "Paste your GitHub Personal Access Token, then press Enter."
echo "(Input is hidden and will not be shown or saved to shell history.)"
printf "Token: "
read -rs TOKEN
echo ""

if [ -z "$TOKEN" ]; then
  echo "No token entered. Aborting."
  exit 1
fi

printf '%s' "$TOKEN" > "$PAT_FILE"
chmod 600 "$PAT_FILE"
unset TOKEN
echo "Saved token to $PAT_FILE (permissions 600)."

if [ -f "$PLIST" ]; then
  launchctl unload "$PLIST" 2>/dev/null || true
  launchctl load "$PLIST"
  echo "LaunchAgent reloaded: $PLIST"
else
  echo "WARNING: LaunchAgent not found. Run scripts/env/install.sh first."
  echo "Setting GITHUB_PAT for this session only."
  launchctl setenv GITHUB_PAT "$(cat "$PAT_FILE")"
fi

sleep 1
MASKED=$(launchctl getenv GITHUB_PAT 2>/dev/null | sed -E 's/(.{7}).*(.{4})/\1...\2/')

echo ""
if [ -n "$MASKED" ]; then
  echo "Success. GITHUB_PAT is set: $MASKED"
  echo ""
  echo "Next steps:"
  echo "  1. Fully quit Kiro (Cmd+Q) and reopen it."
  echo "  2. Approve GITHUB_PAT when Kiro's 'Mcp Approved Env Vars' prompt appears"
  echo "     (or add it in Settings -> search 'Mcp Approved Env Vars')."
else
  echo "GITHUB_PAT does not appear to be set. Check /tmp/petdb-env.err.log"
fi
