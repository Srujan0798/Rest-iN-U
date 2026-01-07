#!/bin/bash
# setup_hooks.sh
# Installs the pre-commit hook into the local .git directory

HOOK_DIR=".git/hooks"
PRE_COMMIT_SRC="pre-commit"

if [ ! -d ".git" ]; then
    echo "Error: .git directory not found. Are you in the root of the repo?"
    exit 1
fi

echo "Installing pre-commit hook..."
cp "$PRE_COMMIT_SRC" "$HOOK_DIR/pre-commit"
chmod +x "$HOOK_DIR/pre-commit"

echo "✅ Pre-commit hook installed."
echo "Any 'git commit' will now automatically scan DevVault for corruption."
