#!/bin/zsh
# Installs the PetDB env LaunchAgent from the repo into the correct macOS
# locations. Safe to re-run. Contains no secrets.
#
# Usage (from repo root):  zsh scripts/env/install.sh
#
# What it does:
#   1. Copies load-env.sh -> ~/.config/petdb/load-env.sh
#   2. Renders the plist template (filling in your home dir) ->
#      ~/Library/LaunchAgents/com.petdb.env.plist
#   3. Loads the LaunchAgent
#
# After installing, run scripts/env/setup-github-pat.sh to store your token.

set -e

SCRIPT_DIR="${0:A:h}"
CONFIG_DIR="$HOME/.config/petdb"
AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST="$AGENTS_DIR/com.petdb.env.plist"

mkdir -p "$CONFIG_DIR" "$AGENTS_DIR"

# 1. Install the loader script.
cp "$SCRIPT_DIR/load-env.sh" "$CONFIG_DIR/load-env.sh"
chmod +x "$CONFIG_DIR/load-env.sh"
echo "Installed $CONFIG_DIR/load-env.sh"

# 2. Render the plist template with the real home directory.
sed "s|__HOME__|$HOME|g" "$SCRIPT_DIR/com.petdb.env.plist.template" > "$PLIST"
echo "Installed $PLIST"

# 3. (Re)load the LaunchAgent.
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "Loaded LaunchAgent com.petdb.env"

echo ""
echo "Done. Next: run  zsh scripts/env/setup-github-pat.sh  to store your GitHub token."
