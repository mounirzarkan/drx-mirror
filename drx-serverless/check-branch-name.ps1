# Define the regular expression for branch name validation
$branchRegex = "^(feature|hotfix)/[A-Z]+-[0-9]+_[A-Z0-9_]+$|^releases/[0-9]+\.[0-9]+$"
$exemptBranches = "^(sit|develop|master|production)$"

# Get the current branch name
$currentBranch = git rev-parse --abbrev-ref HEAD

# Check if the current branch name is one of the exempt branches
if ($currentBranch -match $exemptBranches) {
    Write-Output "Branch name '$currentBranch' is exempt from validation."
    exit 0
}

# Check if the current branch name matches the pattern
if ($currentBranch -match $branchRegex) {
    Write-Output "Branch name '$currentBranch' is valid."
} else {
    Write-Output "Error: Branch name '$currentBranch' is invalid."
    Write-Output "Branch names must follow the conventions:"
    Write-Output "'feature/<JIRA_TASK>_<DESCRIPTION>_<DESCRIPTION>' or 'hotfix/<JIRA_TASK>_<DESCRIPTION>_<DESCRIPTION>'"
    Write-Output "Examples: 'feature/SDW-13245_CUPID_API', 'hotfix/DBR-22345_SOME_FIX'"
    Write-Output "Or 'releases/<major>.<minor>'"
    Write-Output "Examples: 'releases/9.0', 'releases/10.5'"
    Write-Output "Exempt branches: sit, develop, master, production"
    exit 1
}
