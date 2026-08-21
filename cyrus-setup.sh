#!/usr/bin/env bash
# Runs in every fresh Cyrus worktree before the session starts. Keep it fast.
set -euo pipefail
npm install --no-audit --no-fund --silent
echo "everwyn worktree ready: $(node --version), $(npm ls --depth=0 2>/dev/null | tail -n +2 | wc -l | tr -d ' ') dev deps"
