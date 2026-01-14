#!/bin/bash

checkoutPath=$1
stage=$2
region=$3
project=$4

echo $checkoutPath
echo $stage
echo $project
chmod -R 755 $checkoutPath/apiauthorizer/node_modules/serverless/bin/*
#export PATH=`$checkoutPath/apiauthorizer/node_modules/serverless/bin:$PATH`

printenv
pwd
cd $checkoutPath/apiauthorizer
pwd
echo $checkoutPath
$checkoutPath/apiauthorizer/node_modules/serverless/bin/serverless deploy --verbose --stage $stage --region $region --project $project

latestApiVersion=$(aws lambda publish-version --function-name cochlear-drx-apiauthorizer-$stage --region $region | jq -r .Version)
echo "latestApiVersion: $latestApiVersion"

$checkoutPath/apiauthorizer/node_modules/serverless/bin/serverless deploy --verbose --stage $stage --region $region --LATESTVERSION $latestApiVersion --config serverless_alias.yml
