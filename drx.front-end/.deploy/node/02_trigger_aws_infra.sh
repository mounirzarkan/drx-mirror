#!/bin/bash
export INFRA_REF="aws-infra-deploy-preview" #  Infra pipeline

# Testing DGINT-1580, remove after merge
[[ "$CI_COMMIT_BRANCH" =~ ^feature/cross-account ]] && INFRA_REF="feature/cross-account-role-infra-deploy"

echo "Branch: $CI_COMMIT_BRANCH"
echo "Enviroment: $BUILD_ENVIRONMENT"
echo "Trigger pipeline: $INFRA_REF"

curl	--request POST \
        --form token=$CI_JOB_TOKEN \
        --form ref=$INFRA_REF \
        --form "variables[ENVIRONMENT]=$CI_COMMIT_BRANCH" \
        --form "variables[BUILD_ENVIRONMENT]=$BUILD_ENVIRONMENT" \
        --form "variables[BUILD_NUMBER]=$CI_PIPELINE_IID" \
        --form "variables[APP_REGION]=$APP_REGION" \
        "https://gitlab.cochlear.dev/api/v4/projects/$CI_PROJECT_ID/trigger/pipeline"