#!/bin/bash
PROJECT_NAME=$1
PROVIDER=apiauthorizer
# cp -r ./ /tmp/work
# cd /tmp/work

echo "Build & Deploy DRX APIG ${PROVIDER} Lambda and Update Version"

echo "Reading ${PROVIDER} parameters"
cp  ./$PROVIDER/parameters/variables-$ENVIRONMENT.json ./$PROVIDER/variables.json
cat ./$PROVIDER/variables.json

echo "Installing ${PROVIDER} packages"
cd ./$PROVIDER
npm install
npm version

# export LATESTVERSION=$(aws lambda publish-version --function-name cochlear-drx-$PROVIDER-$ENVIRONMENT --region $AWS_REGION | jq -r .Version)
# NEXTVERSION=$((LATESTVERSION + 1))
# echo "Incrementing ${PROVIDER} Latest Version FROM ${LATESTVERSION} TO ${NEXTVERSION}..."

# echo "Deploying ${PROVIDER} lambda to ${ENVIRONMENT}..."
# echo "PROJECT_NAME: ${PROJECT_NAME}"

# $SLS_PROJECT_APIAUTH_NAME replate to=> PROJECT_NAME
# $BUILDKITE_BUILD_NUMBER   replate to=> NEXTVERSION
# $DEPLOYSTAGE              replate to=> ENVIRONMENT
./node_modules/serverless/bin/serverless.js deploy \
    --verbose \
    --stage $ENVIRONMENT \
    --region $AWS_REGION \
    --project $PROJECT_NAME 
    # --versionNumber $NEXTVERSION
