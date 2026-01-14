#!/bin/bash
echo 'Call Clear Old Stack'
chmod -R 755 ./aws/scripts/*.sh

PROJECT_NAME="drx-${1}-lambda"
echo "Clear Stack to ${PROVIDER} lambda on ${ENVIRONMENT} environment..."
echo "PROJECT_NAME: ${PROJECT_NAME}"

./aws/scripts/clearOldStack.sh $PROJECT_NAME $CI_PIPELINE_IID $ENVIRONMENT $AWS_REGION