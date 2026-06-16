#!/usr/bin/env bash
# Launch the forked Hugging Face MCP server over stdio for Claude Code.
# Sources nvm (the repo needs Node >=22.13 / pnpm 11.5) and loads .env for the token.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
  nvm use 22 >/dev/null 2>&1 || true
fi

exec node --env-file="$DIR/.env" "$DIR/packages/app/dist/server/stdio.js" "$@"
