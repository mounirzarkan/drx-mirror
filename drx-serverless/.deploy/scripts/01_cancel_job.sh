#!/bin/bash

URL="https://gitlab.cochlear.dev/api/v4/projects/${CI_PROJECT_ID}/pipelines/${CI_PIPELINE_ID}/jobs?scope=manual"
JSON=$(curl --globoff --header "PRIVATE-TOKEN: ${PROJECT_TOKEN}" ${URL})

if [ "$JSON" == "" ]; then
    red=$(tput setaf 1)
    printf '%s\n' "${red}ERROR DESCRIPTION: Not Content Response" >&2 # write error message to stderr
    exit 1
fi

for row in $(echo "${JSON}" | jq -r '.[] | @base64'); do
    _jq() {
        echo ${row} | base64 --decode | jq -r ${1}
    }
    if [[ $(_jq '.stage') == "check-point" ]]; then
        ID_TO_CANCEL=$(_jq '.id')
        NAME_TO_CANCEL=$name$(_jq '.name')
        echo "Cancelling ${NAME_TO_CANCEL} Deployment. ID: ${ID_TO_CANCEL}"
        curl    --request POST \
                --header "PRIVATE-TOKEN: ${PROJECT_TOKEN}" \
                "https://gitlab.cochlear.dev/api/v4/projects/${CI_PROJECT_ID}/jobs/${ID_TO_CANCEL}/cancel"
    fi
done