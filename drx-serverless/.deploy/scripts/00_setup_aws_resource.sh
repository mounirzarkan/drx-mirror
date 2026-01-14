#!/bin/bash
echo 'Setting up AWS resources'
echo $ENVIRONMENT
chmod -R 755 ./aws/scripts/*.sh

cd ./aws/sceptre
sceptre launch ${ENVIRONMENT}/infra -y

