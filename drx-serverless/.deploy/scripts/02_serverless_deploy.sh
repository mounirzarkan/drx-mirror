#!/bin/bash
echo "Build & Deploy DRX APIG ${PROVIDER} Lambda"
PROJECT_NAME="drx-${1}-lambda"

echo "Reading ${PROVIDER} parameters"
cp  ./$PROVIDER/parameters/variables-$ENVIRONMENT.json ./$PROVIDER/variables.json
cat ./$PROVIDER/variables.json

echo "Installing ${PROVIDER} packages"
cd ./$PROVIDER
npm install
npm version

echo "Deploying ${PROVIDER} lambda to ${ENVIRONMENT}..."
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "VERSION_NUMBER ${CI_PIPELINE_IID}"
# $SLS_PROJECT_x_NAME       replate to=> PROJECT_NAME
# $BUILDKITE_BUILD_NUMBER   replate to=> CI_PIPELINE_IID
# $DEPLOYSTAGE              replate to=> ENVIRONMENT

./node_modules/serverless/bin/serverless.js deploy \
    --stage $ENVIRONMENT \
    --region $AWS_REGION \
    --project $PROJECT_NAME-$CI_PIPELINE_IID \
    --versionNumber $CI_PIPELINE_IID