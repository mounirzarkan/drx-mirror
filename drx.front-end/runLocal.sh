#!/bin/bash

# Example: ./runLocal.sh sit
echo "Runs the local build of DRX Main"

# Capture the command line argument for BUILD_ENVIRONMENT
BUILD_ENVIRONMENT=$1

# Check if BUILD_ENVIRONMENT is provided
if [ -z "$BUILD_ENVIRONMENT" ]; then
    echo "Error: BUILD_ENVIRONMENT is not set. Please provide it as a command line argument, eg ./runLocal.sh sit"
    exit 1
else
    echo "BUILD_ENVIRONMENT is set to '$BUILD_ENVIRONMENT'"
    export BUILD_ENVIRONMENT=$BUILD_ENVIRONMENT
fi

if [ -z "${CI_JOB_TOKEN+x}" ]; then 
    echo "CI_JOB_TOKEN is unset"
else 
    echo "CI_JOB_TOKEN is set to '$CI_JOB_TOKEN'"
fi

if [ -z "${CDS_CI_JOB_TOKEN+x}" ]; then 
    echo "CDS_CI_JOB_TOKEN is unset"
else 
    echo "CDS_CI_JOB_TOKEN is set to '$CDS_CI_JOB_TOKEN'"
fi

# Check if the Docker image exists locally
IMAGE_EXISTS=$(docker images -q drx-main:${BUILD_ENVIRONMENT})
if [ -n "$IMAGE_EXISTS" ]; then
    echo "Image drx-main:${BUILD_ENVIRONMENT} exists locally."
    # Check if the container exists (running or stopped)
    CONTAINER_ID=$(docker ps -a -q -f name=drx-main-local-${BUILD_ENVIRONMENT})
    if [ -n "$CONTAINER_ID" ]; then
        echo "Container drx-main-local-${BUILD_ENVIRONMENT} exists with ID $CONTAINER_ID"
        # Stop the container if it's running
        docker stop drx-main-local-${BUILD_ENVIRONMENT} || true
        # Remove the container
        docker rm drx-main-local-${BUILD_ENVIRONMENT}
    else
        echo "Container drx-main-local-${BUILD_ENVIRONMENT} does not exist."
    fi
else
    echo "Image drx-main:${BUILD_ENVIRONMENT} does not exist locally."
    echo "Building the image..."

    # Check platform
    if [[ "$(uname -m)" == "x86_64" ]]; then
        PLATFORM="linux/amd64"
    else
        PLATFORM="linux/arm64/v8"
    fi

    # Build the Docker image
    DOCKER_BUILDKIT=1 docker build -f ./Dockerfile.local -t drx-main:${BUILD_ENVIRONMENT} \
        --platform $PLATFORM \
        --build-arg CI_JOB_TOKEN="${CI_JOB_TOKEN}" \
        --build-arg CDS_CI_JOB_TOKEN="${CDS_CI_JOB_TOKEN}" \
        --build-arg BUILD_ENVIRONMENT="${BUILD_ENVIRONMENT}" .
fi

# Run the Docker container
docker compose up --watch
