#!/usr/bin/env bash 

for d in */ 
do
  if [ "$d" == "aws/" ]
  then
    echo "skip $d"
    continue
  fi
  echo "upgrade $d"
  cd "$d" || exit 1
  npm update
  npm upgrade
  npm audit fix
  npm i
  npm ls --depth 0
  cd ..
done
