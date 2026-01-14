stackName=$1
buildNumber=$2
stage=$3
region=$4
echo $stackName
echo $buildNumber
echo $stage
echo $region

echo "Clear Old Stack"

if [[ -z "${stackName// }" ]]; then
    echo "Error Stack name not defined"
    exit 1
fi

if [[ -z "${buildNumber// }" ]]; then
    echo "Error build number is empty"
    exit 1
fi

if [[ -z "${stage// }" ]]; then
    echo "Error stage is empty"
    exit 1
fi

if [[ -z "${region// }" ]]; then
    echo "Error region is empty"
    exit 1
fi

for word in $(aws cloudformation list-stacks --region $region --stack-status-filter "CREATE_COMPLETE" "UPDATE_COMPLETE" "UPDATE_ROLLBACK_COMPLETE" "CREATE_FAILED" "DELETE_FAILED" "ROLLBACK_COMPLETE" |jq .StackSummaries[].StackName |grep "$stackName-.*-$stage")
do
  if [ "$word" != "\"$stackName-$buildNumber-$stage\"" ]; then
     if [ "\"$stage\"" == "$(aws cloudformation describe-stacks --region $region --stack-name ${word//\"} |jq .Stacks[0].Tags| jq 'from_entries' | jq .STAGE)" ]; then
       echo "${word//\"}"
      #  sg=$(aws cloudformation describe-stack-resources --stack-name ${word//\"} | jq '.StackResources[] | select(.LogicalResourceId == "DRXLambdaSecurityGroup")' | jq .PhysicalResourceId)
      #  attachmentId=$(aws ec2 describe-network-interfaces --filters Name=group-id,Values=${sg//\"} | jq .NetworkInterfaces[0].Attachment.AttachmentId)
      #  eni=$(aws ec2 describe-network-interfaces --filters Name=group-id,Values=${sg//\"} | jq .NetworkInterfaces[0].NetworkInterfaceId)
      #  if [[ "$attachmentId" != null ]]; then
      #   echo "attachment network interface id : $attachmentId"
      #   aws ec2 detach-network-interface --attachment-id ${attachmentId//\"}
      #   aws ec2 wait network-interface-available --network-interface-ids ${eni//\"}
      #  fi
      #  if [[ "$eni" != null ]]; then
      #   echo "network interface id : ${eni}"
      #   aws ec2 delete-network-interface --network-interface-id ${eni//\"}
      #  fi
       aws cloudformation delete-stack --region $region --stack-name ${word//\"}
       #aws cloudformation wait stack-delete-complete --stack-name ${word//\"}
    fi
  fi
done

