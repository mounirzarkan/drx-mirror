##!/bin/bash
echo "NPM Tests:"
mkdir -p coverage
npm install -g junit-report-merger

# Define all the api directories where unit tests will be run
directories=("account" "address" "apiauthorizer" "auth" "cache-refresh" "device" "header-footer" "orders" "regions" "service-requests" "uhmenu" "userid" "utils" "webcase" "enquiry" "subscriptions" "loss-claims" "clinics")

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "Directory $dir does not exist"
        continue
    fi
    
    # Install npm packages
    echo "Installing dependencies in $dir"
    (cd "$dir" && npm install)
    
    # Run the unit tests
    echo "Running tests for $dir"
    (cd "$dir" && npm test)

    # Generate the coverage report
    echo "Running coverage for $dir"
    (cd "$dir" && npm run coverage)
    
    if [ -f "$dir/coverage/lcov.info" ]; then
        # Append the results of each report to a single file in the project root
        echo "Appending lcov.info from $dir"
        cat "$dir/coverage/lcov.info" >> coverage/lcov.info
    else
        echo "lcov.info not found in $dir"
    fi

    if [ -f "$dir/test-results.xml" ]; then
        # Add each test-results.xml report to the project root
        echo "Add test-results.xml to the project root for $dir"
        cat "$dir/test-results.xml" >> "test-results-$dir.xml"
    else
        echo "test-results.xml not found in $dir"
    fi
done

# Merge all the test-results files into a single file in the project root
jrm ./test-results.xml "./test-results-*.xml"

if [ $? -ne 0 ]; then
    exit 1
fi
