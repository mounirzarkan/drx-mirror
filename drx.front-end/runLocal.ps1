# Example: ./runLocal.ps1 sit
Write-Output "Runs the local build of DRX Main"

# Capture the command line argument for BUILD_ENVIRONMENT
param (
    [string]$BUILD_ENVIRONMENT
)

# Check if BUILD_ENVIRONMENT is provided
if (-not $BUILD_ENVIRONMENT) {
    Write-Output "Error: BUILD_ENVIRONMENT is not set. Please provide it as a command line argument, eg ./runLocal.ps1 sit"
    exit 1
} else {
    Write-Output "BUILD_ENVIRONMENT is set to '$BUILD_ENVIRONMENT'"
    $env:BUILD_ENVIRONMENT = $BUILD_ENVIRONMENT
}

if (-not $env:CI_JOB_TOKEN) {
    Write-Output "CI_JOB_TOKEN is unset"
} else {
    Write-Output "CI_JOB_TOKEN is set to '$env:CI_JOB_TOKEN'"
}

if (-not $env:CDS_CI_JOB_TOKEN) {
    Write-Output "CDS_CI_JOB_TOKEN is unset"
} else {
    Write-Output "CDS_CI_JOB_TOKEN is set to '$env:CDS_CI_JOB_TOKEN'"
}

# Check if the Docker image exists locally
$IMAGE_EXISTS = docker images -q drx-main:$BUILD_ENVIRONMENT
if ($IMAGE_EXISTS) {
    Write-Output "Image drx-main:$BUILD_ENVIRONMENT exists locally."
    # Check if the container exists (running or stopped)
    $CONTAINER_ID = docker ps -a -q -f "name=drx-main-local-$BUILD_ENVIRONMENT"
    if ($CONTAINER_ID) {
        Write-Output "Container drx-main-local-$BUILD_ENVIRONMENT exists with ID $CONTAINER_ID"
        # Stop the container if it's running
        docker stop drx-main-local-$BUILD_ENVIRONMENT
        # Remove the container
        docker rm drx-main-local-$BUILD_ENVIRONMENT
    } else {
        Write-Output "Container drx-main-local-$BUILD_ENVIRONMENT does not exist."
    }
} else {
    Write-Output "Image drx-main:$BUILD_ENVIRONMENT does not exist locally."
    Write-Output "Building the image..."

    # Check platform
    $PLATFORM = if ([System.Environment]::Is64BitOperatingSystem) { "linux/amd64" } else { "linux/arm64/v8" }

    # Build the Docker image
    $env:DOCKER_BUILDKIT = 1
    docker build -f ./Dockerfile.local -t drx-main:$BUILD_ENVIRONMENT `
        --platform $PLATFORM `
        --build-arg CI_JOB_TOKEN=$env:CI_JOB_TOKEN `
        --build-arg CDS_CI_JOB_TOKEN=$env:CDS_CI_JOB_TOKEN `
        --build-arg BUILD_ENVIRONMENT=$BUILD_ENVIRONMENT
}

# Run the Docker container
docker compose up --watch
