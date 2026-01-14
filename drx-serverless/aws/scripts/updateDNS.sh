projectName=$1
buildNumber=$2
stage=$3
basepath=$4
domainName=$5
region=$6

echo $projectName
echo $buildNumber
echo $stage
echo $basepath
echo $domainName
echo $region

stackName="$projectName-$buildNumber-$stage"

stackOutput=$(aws --region $region cloudformation describe-stacks --stack-name "$stackName" )
restApiId=$(echo $stackOutput | jq --raw-output '.["Stacks"][0]["Outputs"] | map(select(.OutputKey == "RestApiId"))[0].OutputValue')
echo "restApiId $restApiId"

oldRestApiId=$(aws apigateway get-base-path-mapping --region $region --domain-name $domainName --base-path $basepath  | jq .restApiId)
echo "oldRestApiId $oldRestApiId"
if [[ -z "${oldRestApiId// }" ]]; then
    echo "no basepath found"
    aws apigateway create-base-path-mapping --region $region --domain-name $domainName --base-path $basepath --rest-api-id $restApiId --stage $stage  
elif [[ -n "${oldRestApiId// }" ]]; then
    echo "basepath found"
    aws apigateway delete-base-path-mapping --region $region --domain-name $domainName --base-path $basepath  
    aws apigateway create-base-path-mapping --region $region --domain-name $domainName --base-path $basepath --rest-api-id $restApiId --stage $stage  
fi