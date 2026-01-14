#!/bin/bash
PROJECT_NAME=$1
echo "Exporting ${PROVIDER} Lastest Version..."
export LATESTVERSION=$(aws lambda publish-version --function-name cochlear-drx-$PROVIDER-$ENVIRONMENT --region $AWS_REGION | jq -r .Version)
echo "LATESTVERSION $LATESTVERSION"

echo "Applying ${LATESTVERSION} version to alias."
echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "PROJECT_NAME: ${PROJECT_NAME}"

cd ./$PROVIDER
# Removed: aws lambda create-alias --function-name cochlear-drx-apiauthorizer-$DEPLOYSTAGE --name V1  --function-version $$latestApiVersion
./node_modules/serverless/bin/serverless.js deploy \
    --verbose \
    --stage $ENVIRONMENT \
    --region $AWS_REGION \
    --LATESTVERSION $LATESTVERSION \
    --config serverless_alias.yml \
    --project ${PROJECT_NAME}-Alias