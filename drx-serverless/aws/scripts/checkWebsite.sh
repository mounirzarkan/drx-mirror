projectName=$1
buildNumber=$2
stage=$3
keyword=$4
testPath=$5
params=$6

echo "$projectName"
echo "$buildNumber"
echo "$stage"
echo "$keyword"
echo "$testPath"
echo "$params"

stackName="$projectName-$buildNumber-$stage"
echo "$stackName"

stackOutput=$(aws --region ap-southeast-2 cloudformation describe-stacks --stack-name "$stackName")
ServiceEndpoint=$( echo "$stackOutput" | jq --raw-output '.["Stacks"][0]["Outputs"] | map(select(.OutputKey == "ServiceEndpoint"))[0].OutputValue' )
echo "$ServiceEndpoint"

if [ -z "${ServiceEndpoint}" ]; then
    echo "Error api endpoint value is empty"
    exit 1
fi

websiteEndpoint="$ServiceEndpoint/v1/$testPath"
if [ -z "$params" ]
then
  echo 'no params for checkWebsite'
else
  websiteEndpoint="$websiteEndpoint?$params"
fi

echo "websiteEndpoint: "
echo "$websiteEndpoint"


# deploystart=$(date +%s)
# timeout=120 # Seconds to wait before error
# threshhold=$((deploystart + timeout))
# while true; do

#     timenow=$(date +%s)
#     if [ "$timenow" -gt "$threshhold" ]; then
#         echo "Timeout - $timeout seconds elapsed"
#         echo "Error with website: $websiteEndpoint!"
#         exit 1
#     fi

#     if curl -s -k -i "$websiteEndpoint" | grep "$keyword" > /dev/null
#     then
#         # if the keyword is in the conent
#         echo "$websiteEndpoint has the matching string...working fine"
#         break
#     else
#         echo "Error unable to verify keyword in Website"
#         sleep 10
#         continue
#     fi

#     break
# done
