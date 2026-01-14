#!/bin/bash

stackName=$1
stackVersion=$2
template=$3
params=$4
outputFile=$5
path=$6
env=$7

echo $stackName
echo $stackVersion
echo $template
echo $params
echo $outputFile
echo $path
echo $env

echo "Schedule Clear Old Stack"

if [[ -z "${stackName// }" ]]; then
    echo "Error Stack name not defined"
    exit 1
fi

if [[ -z "${stackVersion// }" ]]; then
    echo "Error stack Version is empty"
    exit 1
fi

for word in $(aws cloudformation list-stacks --stack-status-filter "CREATE_COMPLETE" "UPDATE_COMPLETE" "UPDATE_ROLLBACK_COMPLETE"|jq .StackSummaries[].StackName |grep "$stackName.*ttl")
do
  echo "${word//\"}"
  aws cloudformation delete-stack --stack-name ${word//\"}
  aws cloudformation wait stack-delete-complete --stack-name ${word//\"}
done

for word in $(aws cloudformation list-stacks --stack-status-filter "CREATE_COMPLETE" "UPDATE_COMPLETE" "UPDATE_ROLLBACK_COMPLETE"|jq .StackSummaries[].StackName |grep $stackName)
do
  if [ "$word" != "\"$stackName-$stackVersion\"" ]; then
     if [ "\"$stackName\"" == "$(aws cloudformation describe-stacks --stack-name ${word//\"} |jq .Stacks[0].Tags| jq 'from_entries' | jq .Name)" ]; then
      echo "${word//\"}"
      cat $params | jq "map(if .ParameterKey == \"StackName\" then . + {\"ParameterValue\":\"${word//\"}\"} else . end)" > $outputFile
      aws --region ap-southeast-2 cloudformation create-stack --disable-rollback --stack-name "${word//\"}-ttl" --template-body "$(cat $template)" --parameters "$(cat $outputFile)" --tags Key=Name,Value=${word//\"}-ttl Key=Version,Value=$stackVersion Key=Environment,Value=$env Key=Resource,Value=cochlear-drx --capabilities CAPABILITY_NAMED_IAM
      aws --region ap-southeast-2 cloudformation wait stack-create-complete --stack-name "${word//\"}-ttl"
      sh $path/aws/scripts/updateAutoScaleGroup.sh ${word//\"} 0
    fi
  fi
done

