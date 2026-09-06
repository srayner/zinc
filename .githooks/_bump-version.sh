#!/bin/bash
# Shared version-bump logic, called from the pre-commit hook.
# Bumps the package.json patch version when committing on `main`, so every
# update to main carries a new version number. Feature branches are untouched.
#
# Merges into main use `git merge --no-ff --no-commit` (see branch.main
# mergeoptions / README), so the merge is finalised by a plain `git commit`
# that runs this via pre-commit too.
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  exit 0
fi

# Skip if a version change is already staged (e.g. a manual `npm version`).
if git diff --cached -U0 -- package.json | grep -qE '^\+\s*"version":'; then
  exit 0
fi

CURRENT=$(node -p "require('./package.json').version")
npm version patch --no-git-tag-version --allow-same-version >/dev/null
NEXT=$(node -p "require('./package.json').version")

git add package.json package-lock.json
echo "version bumped ${CURRENT} -> ${NEXT}"
