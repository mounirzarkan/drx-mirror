#!/bin/bash
export WORK_PATH="${WORK_PATH:=/work}"
cd $WORK_PATH

CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)
CDS_CI_JOB_TOKEN=$(aws secretsmanager get-secret-value --secret-id drx/cds-gitlab-ci-token --region ap-southeast-2 --query SecretString --output text)

export CI_JOB_TOKEN=$CI_JOB_TOKEN
export CDS_CI_JOB_TOKEN=$CDS_CI_JOB_TOKEN

source /etc/profile
npm install --legacy-peer-deps || true 
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    exit 1
fi
cd ./node-headless-ssr-proxy
npm install --legacy-peer-deps
