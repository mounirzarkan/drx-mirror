#!/bin/bash
PROJECT_NAME=$1
# PROVIDER=apiauthorizer
# cp -r ./ /tmp/work
# cd /tmp/work
chmod -R 755 ./aws/scripts/*.sh

echo "prepare serverless framework"
./aws/scripts/cachePackage.sh $DEPLOY_S3_BUCKET "MAIN-$ENVIRONMENT"
# npm install 

echo "Build & Deploy DRX APIG ${PROVIDER} Lambda and Update Version"

echo "Reading ${PROVIDER} parameters"
cp  ./$PROVIDER/parameters/variables-$ENVIRONMENT.json ./$PROVIDER/variables.json
cp ./aws_infra_parameters ./$PROVIDER/aws_infra_parameters.json
cp ./aws_resource_parameters ./$PROVIDER/aws_resource_parameters.json
cp ./lambda_common_env_parameters ./$PROVIDER/lambda_common_env_parameters.json

cat ./$PROVIDER/variables.json
cat ./$PROVIDER/aws_infra_parameters.json
cat ./$PROVIDER/aws_resource_parameters.json


echo "Installing ${PROVIDER} packages"
cd ./$PROVIDER
../aws/scripts/cachePackage.sh ${DEPLOY_S3_BUCKET} "${PROVIDER}-${ENVIRONMENT}"
# npm install
# npm version

# export LATESTVERSION=$(aws lambda publish-version --function-name cochlear-drx-$PROVIDER-$ENVIRONMENT --region $AWS_REGION | jq -r .Version)
# NEXTVERSION=$((LATESTVERSION + 1))
# echo "Incrementing ${PROVIDER} Latest Version FROM ${LATESTVERSION} TO ${NEXTVERSION}..."

# echo "Deploying ${PROVIDER} lambda to ${ENVIRONMENT}..."
# echo "PROJECT_NAME: ${PROJECT_NAME}"

# $SLS_PROJECT_APIAUTH_NAME replate to=> PROJECT_NAME
# $BUILDKITE_BUILD_NUMBER   replate to=> NEXTVERSION
# $DEPLOYSTAGE              replate to=> ENVIRONMENT



../node_modules/serverless/bin/serverless.js deploy 
    # --verbose \
    # --stage $ENVIRONMENT \
    # --region $AWS_REGION \
    # --project $PROJECT_NAME-$PROVIDER 




    # --versionNumber $NEXTVERSION
