#!/bin/bash
echo "NPM Tests:"
rm -f scjssconfig.json
cp ./jss-build-parameters/scjssconfig.json.${BUILD_ENVIRONMENT}_node ./scjssconfig.json

CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)
CDS_CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/cds-gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)

export CI_JOB_TOKEN=$CI_JOB_TOKEN
export CDS_CI_JOB_TOKEN=$CDS_CI_JOB_TOKEN

npm install --legacy-peer-deps || true 
npm install --legacy-peer-deps
npm run test
if [ $? -ne 0 ]; then
    exit 1
fi
