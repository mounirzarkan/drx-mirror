#!/bin/bash
echo 'Call Update DNS'
chmod -R 755 ./aws/scripts/*.sh

PROJECT_NAME="drx-${1}-lambda"
BASEPATH="drx-${2}"

echo "Updating DNS to ${PROVIDER} lambda on ${ENVIRONMENT} environment..."
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "BASEPATH: ${BASEPATH}"

if [ "$ENVIRONMENT" == "prd" ]; then
    #Removed: echo "Running checkWebsite for ${PROVIDER}"    
    #Removed: ./aws/scripts/checkWebsite.sh $PROJECT_NAME $CI_PIPELINE_IID $ENVIRONMENT 401 $BASEPATH
    DOMAIN_NAME="api.cochlear.com"
    echo "DOMAIN_NAME: ${DOMAIN_NAME}"
    ./aws/scripts/updateDNS.sh $PROJECT_NAME $CI_PIPELINE_IID $ENVIRONMENT $BASEPATH $DOMAIN_NAME $AWS_REGION
else
    #Removed: echo "Running checkWebsite for ${PROVIDER}"    
    #Removed: ./aws/scripts/checkWebsite.sh $PROJECT_NAME $CI_PIPELINE_IID $ENVIRONMENT 401 $ENVIRONMENT-$BASEPATH
    DOMAIN_NAME="authapi.cochlear.com"
    echo "DOMAIN_NAME: ${DOMAIN_NAME}"
    ./aws/scripts/updateDNS.sh $PROJECT_NAME $CI_PIPELINE_IID $ENVIRONMENT $ENVIRONMENT-$BASEPATH $DOMAIN_NAME $AWS_REGION
fi