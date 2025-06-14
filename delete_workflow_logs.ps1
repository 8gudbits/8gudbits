# Set-ExecutionPolicy Unrestricted
# .\delete_workflow_logs.ps1
param ([string]$Username = "8gudbits")

$Repo = "$Username/$Username"

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Fetch all workflow run IDs
$workflowRuns = gh api repos/$Repo/actions/runs --paginate --jq '.workflow_runs[].id'

# Loop through and delete each run
foreach ($runId in $workflowRuns) {
    Write-Host "Deleting workflow run ID: $runId"
    gh api repos/$Repo/actions/runs/$runId -X DELETE
}

Write-Host "All workflow runs have been deleted!"
