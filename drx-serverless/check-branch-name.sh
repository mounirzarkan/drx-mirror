#!/bin/bash

# Define the regular expression for branch name validation
BRANCH_REGEX="^(feature|hotfix)/[A-Z]+-[0-9]+_[A-Z0-9_]+$|^releases/[0-9]+\.[0-9]+$"
EXEMPT_BRANCHES="^(sit|develop|master|production)$"

# Get the current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Check if the current branch name is one of the exempt branches
if [[ $CURRENT_BRANCH =~ $EXEMPT_BRANCHES ]]; then
  echo "Branch name '$CURRENT_BRANCH' is exempt from validation."
  exit 0
fi

# Check if the current branch name matches the pattern
if [[ $CURRENT_BRANCH =~ $BRANCH_REGEX ]]; then
  echo "Branch name '$CURRENT_BRANCH' is valid."
else
  echo "Error: Branch name '$CURRENT_BRANCH' is invalid."
  echo "Branch names must follow the conventions:"
  echo "'feature/<JIRA_TASK>_<DESCRIPTION>' or 'hotfix/<JIRA_TASK>_<DESCRIPTION>'"
  echo "Examples: 'feature/SDW-13245_CUPID_API', 'hotfix/DBR-22345_SOME_FIX'"
  echo "Or 'releases/<major>.<minor>'"
  echo "Examples: 'releases/9.0', 'releases/10.5'"
  echo "Exempt branches: sit, develop, master, production"
  exit 1
fi
