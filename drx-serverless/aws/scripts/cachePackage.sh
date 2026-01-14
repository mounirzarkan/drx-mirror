bucket=${1}
fileName=${2}

fileExist=$(aws s3 ls s3://$bucket/node_package/${fileName}.tar)
echo $fileExist
if [  -z "$fileExist" ]
then
  echo "file is not exist, prepare to run npm install and upload to s3 bucket"
  npm install
  echo "zipping the files"
  tar czvf ${fileName}.tar ./node_modules package.json package-lock.json > /dev/null 2>&1
  echo "uploading to s3 bucket"
  aws s3 cp ./${fileName}.tar s3://$bucket/node_package/${fileName}.tar
  echo "upload completed"
  rm -f ${fileName}.tar
else
  echo "file exist and copy it down and parepare to compare"
  aws s3 cp s3://$bucket/node_package/${fileName}.tar ./
  rm -rf node_temp || true
  mkdir node_temp
  cd node_temp
  cp ../${fileName}.tar ./
  tar xzvf ${fileName}.tar > /dev/null 2>&1
  cd ..
  packageFileDifferent=$(diff package.json ./node_temp/package.json)
  # packageLockFileDifferent=$(diff package-lock.json ./node_temp/package-lock.json) 
  echo $packageFileDifferent
  # echo $packageLockFileDifferent
  # if [ ! -z "$packageLockFileDifferent" ] || [ ! -z "$fileDifferent" ];
  # fileDifferent=$(diff package.json ./node_temp/package.json)
  if [ ! -z "$packageFileDifferent" ]
  then 
    echo "package.json shows differents, prepare to run npm install and use it as current"
    rm -rf node_modules || true
    rm -rf node_temp || true
    npm install
    echo "zipping the files"
    tar czvf ${fileName}.tar ./node_modules package.json package-lock.json > /dev/null 2>&1
    echo "uploading to s3 bucket"
    aws s3 cp ./${fileName}.tar s3://$bucket/node_package/${fileName}.tar
    echo "upload completed"
    rm -f ${fileName}.tar
  else
   echo "package.json is same, use it as current"
   rm -rf node_modules || true
   mv ./node_temp/node_modules ./node_modules
   rm -rf node_temp
   rm -f ${fileName}.tar
   #npm install
  fi
fi
# ./package.sh cochlear-drx-dev-deployment-bucket Qualys/qualys-cloud-agent.x86_64.rpm

