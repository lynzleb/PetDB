# Environment setup (macOS)

Makes `GITHUB_PAT` available to Kiro (and all apps) across every login session,
so the GitHub MCP server can authenticate no matter how Kiro is launched.

These files are safe to commit — **none of them contain the token**. The token
lives only in `~/.config/petdb/github_pat` (outside the repo, chmod 600).

## Files

| File | Role |
|------|------|
| `install.sh` | Copies the loader + LaunchAgent into place and loads it. Run once per machine. |
| `com.petdb.env.plist.template` | LaunchAgent template. `__HOME__` is filled in by `install.sh`. |
| `load-env.sh` | Reads the token file and sets `GITHUB_PAT` via `launchctl`. Runs at each login. |
| `setup-github-pat.sh` | Prompts for your token (hidden) and stores it securely. |

## How it works

```
login  →  LaunchAgent runs  →  load-env.sh  →  sets GITHUB_PAT  →  Kiro sees it
```

`launchctl setenv` sets the variable at the login-session level, so unlike a
shell `export` (which only the launching terminal sees), every app started
afterward inherits it — Dock, Spotlight, or terminal.

## Usage

From the repo root, one time per machine:

```bash
zsh scripts/env/install.sh          # installs + loads the LaunchAgent
zsh scripts/env/setup-github-pat.sh # paste your GitHub PAT when prompted
```

Then fully quit Kiro (Cmd+Q) and reopen it. Approve `GITHUB_PAT` when Kiro's
"Mcp Approved Env Vars" prompt appears (or add it in Settings).

## Rotating the token

Re-run `setup-github-pat.sh` and paste the new token. Nothing else changes.

## Uninstalling

```bash
launchctl unload ~/Library/LaunchAgents/com.petdb.env.plist
rm ~/Library/LaunchAgents/com.petdb.env.plist
rm -rf ~/.config/petdb
```

## Getting a GitHub token

github.com → Settings → Developer settings → Personal access tokens.
Fine-grained token scoped to this repo with **Contents: read/write** and
**Pull requests: read/write** is enough for committing and opening PRs.
