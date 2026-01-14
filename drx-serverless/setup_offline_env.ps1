# Check if the first argument is 'dev' or 'sit'
param([ValidateSet('dev','sit')]$env)

if (-not $env) {
    Write-Error "Error: The environment must be 'dev' or 'sit'."
    exit 1
}

# Array of sub-folders to move the files to
$sub_folders = @('account', 'address', 'apiauthorizer', 'auth', 'cache-refresh', 'orders', 'device', 'header-footer', 'regions', 'uhmenu', 'service-requests', 'utils')

# Base S3 path
$s3_base_path = "s3://cochlear-drx-cx-dev-deployment/config/$env"

# Array of file names
$file_names = @('aws_infra_parameters.json', 'aws_resource_parameters.json', 'lambda_common_env_parameters.json')

Write-Verbose "Downloading files from S3..."
Write-Verbose ""
# Download the files once to the root directory
foreach ($file_name in $file_names) {
    # Construct the full S3 path
    $s3_file = "$s3_base_path/$file_name"

    # Download the .json file from S3
    try {
        aws s3 cp $s3_file "./$file_name"
        Write-Verbose "Downloaded $file_name successfully."
        Write-Verbose ""
    } catch {
        Write-Error "Failed to download $file_name from S3."
        Write-Verbose ""
        exit 1 # Exit if any file fails to download
    }
}

Write-Verbose "Copying files to sub-folders..."
Write-Verbose ""
# Loop through the sub-folders and copy the files
foreach ($folder in $sub_folders) {
    # Create sub-folder if it doesn't exist
    New-Item -ItemType Directory -Force -Path $folder
    Write-Verbose "Folder: $folder"
    Write-Verbose ""
    # Copy the files to the sub-folder, overwriting existing ones
    foreach ($file_name in $file_names) {
        Copy-Item -Path "./$file_name" -Destination "$folder/" -Force
        Write-Verbose "Copied $file_name to $folder successfully."
    }

    # Copy the variables file from the parameters sub-directory and rename it
    Copy-Item -Path "$folder/parameters/variables-$env.json" -Destination "$folder/variables.json" -Force
    Write-Verbose "Copied variables-$env.json to $folder/variables.json successfully."
    Write-Verbose ""
}
