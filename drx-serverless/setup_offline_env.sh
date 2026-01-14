#!/bin/bash

# Check if the first argument is 'dev' or 'sit'
if [[ "$1" != "dev" && "$1" != "sit" ]]; then
  echo "Error: The environment must be 'dev' or 'sit'."
  exit 1
fi

# Environment variable (dev or sit)
env=$1

# Array of sub-folders to move the files to
sub_folders=("account" "address" "apiauthorizer" "auth" "cache-refresh" "orders" "device" "header-footer" "regions" "uhmenu" "service-requests" "utils")

# Base S3 path
s3_base_path="s3://cochlear-drx-cx-dev-deployment/config/$env"

# Array of file names
file_names=("aws_infra_parameters.json" "aws_resource_parameters.json" "lambda_common_env_parameters.json")

echo "Downloading files from S3..."
echo ""
# Download the files once to the root directory
for file_name in "${file_names[@]}"; do
  # Construct the full S3 path
  s3_file="$s3_base_path/$file_name"

  # Download the .json file from S3
  if aws s3 cp "$s3_file" "./$file_name"; then
    echo "Downloaded $file_name successfully."
    echo ""
  else
    echo "Failed to download $file_name from S3."
    echo ""
    exit 1 # Exit if any file fails to download
  fi
done
echo "Copying files to sub-folders..."
echo ""
# Loop through the sub-folders and copy the files
for folder in "${sub_folders[@]}"; do
  # Create sub-folder if it doesn't exist
  mkdir -p "$folder"
  echo "Folder:" $folder
  echo ""
  # Copy the files to the sub-folder, overwriting existing ones
  for file_name in "${file_names[@]}"; do
    if cp -f "./$file_name" "$folder/"; then
      echo "Copied $file_name to $folder successfully."
    else
      echo "Failed to copy $file_name to $folder."
    fi
  done

  # Copy the variables file from the parameters sub-directory and rename it
  if cp "$folder/parameters/variables-$env.json" "$folder/variables.json"; then
    echo "Copied variables-$env.json to $folder/variables.json successfully."
  else
    echo "Failed to copy variables-$env.json to $folder/variables.json."
  fi
  echo ""
done