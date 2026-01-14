#!/bin/bash
export WORK_PATH="${WORK_PATH:=/work}"
cd $WORK_PATH

CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)
CDS_CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/cds-gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)

export CI_JOB_TOKEN=$CI_JOB_TOKEN
export CDS_CI_JOB_TOKEN=$CDS_CI_JOB_TOKEN

source /etc/profile
echo "REACT_APP_DRX_ENV=$(echo $BUILD_ENVIRONMENT | tr [a-z] [A-Z])" >> .env
cat .env

echo "Define BUILD_ARTIFACT_BUCKET from BUILD_ENVIRONMENT"
BUILD_ARTIFACT_BUCKET="cochlear-drx-cx-dev-deployment" # Default to dev if dev,sit or uat
[[ "$BUILD_ENVIRONMENT" == "prd" || "$BUILD_ENVIRONMENT" == "preview-prd" ]] && BUILD_ARTIFACT_BUCKET="cochlear-drx-cx-prd-deployment" 
echo $BUILD_ARTIFACT_BUCKET

rm -f scjssconfig.json
cp ./jss-build-parameters/scjssconfig.json.${BUILD_ENVIRONMENT}_node ./scjssconfig.json

npm run jss build
if [ $? -ne 0 ]; then
    exit 1
fi

mkdir -p node-headless-ssr-proxy/dist/drx
cp -r ./build/* ./node-headless-ssr-proxy/dist/drx
cd ./node-headless-ssr-proxy
rm -f config.js
cp ./jss-proxy-config/config-${BUILD_ENVIRONMENT}.js ./config.js
cp ./newrelic-config/newrelic-${BUILD_ENVIRONMENT}.js ./newrelic.js
zip -r build-$CI_PIPELINE_IID.zip ./ > /dev/null 2>&1
echo "Build Completed"

export FROM=./build-$CI_PIPELINE_IID.zip
export TO=s3://$BUILD_ARTIFACT_BUCKET/artifacts/$APP_STACK_NAME-$CI_PIPELINE_IID.zip
echo "Uploading to S3: $TO"

aws s3 cp $FROM $TO 
result=$(echo $?)

if [[ $result == 0 ]]; then
    echo "File Uploaded as $TO"
    exit 0
elif [[ $result == 1 ]]; then
    echo "At least one or more s3 transfers failed for the command executed"
    exit 1
elif [[ $result == 2 ]]; then
    echo "It can mean at least one or more files marked for transfer were skipped during the transfer process."
    exit 1
elif [[ $result == 133 ]]; then
    echo "The process received a SIGINT (Ctrl-C)."
    exit 1
elif [[ $result == 255 ]]; then
    echo "Command failed. There were errors thrown by either the CLI or by the service the request was made to."
    exit 1
else
    echo "Unknown error"
    exit 1
fi
