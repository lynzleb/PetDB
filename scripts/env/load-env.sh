#!/bin/zsh
# Loads PetDB-related secrets into the macOS login session so that both
# terminal and GUI-launched apps (e.g. Kiro from the Dock) can see them.
#
# Secrets are read from files in ~/.config/petdb/ so no token is ever
# stored in this script or in the LaunchAgent plist.
#
# Invoked at login by ~/Library/LaunchAgents/com.petdb.env.plist
# (installed via scripts/env/install.sh).

PAT_FILE="$HOME/.config/petdb/github_pat"

if [ -f "$PAT_FILE" ]; then
  # Strip any trailing newline/whitespace just in case.
  GITHUB_PAT="$(tr -d '[:space:]' < "$PAT_FILE")"
  /bin/launchctl setenv GITHUB_PAT "$GITHUB_PAT"
fi
