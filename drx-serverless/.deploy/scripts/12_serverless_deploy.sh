#!/bin/bash
echo "prepare serverless framework"
./aws/scripts/cachePackage.sh $DEPLOY_S3_BUCKET "MAIN-$ENVIRONMENT"
# npm install
echo "Build & Deploy DRX APIG ${PROVIDER} Lambda"
PROJECT_NAME=${1}
# cp -r ./ /tmp/work
# cd /tmp/work

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
echo "Deploying ${PROVIDER} lambda to ${ENVIRONMENT}..."
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "VERSION_NUMBER ${CI_PIPELINE_IID}"

../node_modules/serverless/bin/serverless.js deploy 
# $SLS_PROJECT_x_NAME       replate to=> PROJECT_NAME
# $BUILDKITE_BUILD_NUMBER   replate to=> CI_PIPELINE_IID
# $DEPLOYSTAGE              replate to=> ENVIRONMENT

# if [ "$PROVIDER" == "header-footer" ]; then
#     echo "Include KMSArn"
#     ./node_modules/serverless/bin/serverless.js deploy \
#         --stage $ENVIRONMENT \
#         --region $AWS_REGION \
#         --project $PROJECT_NAME-$CI_PIPELINE_IID \
#         --versionNumber $CI_PIPELINE_IID \
#         --KMSArn $KMS_ARN
# else
#     echo "KMSArn not needed"
    
        # --stage $ENVIRONMENT \
        # --region $AWS_REGION \
        # --project $PROJECT_NAME \
        # --versionNumber $CI_PIPELINE_IID 
# fi