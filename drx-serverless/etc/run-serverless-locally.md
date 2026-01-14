# Running/Developing Serverless Locally

The following describes how to setup and run the application locally. Ensure that you have the
[Node Version Manager](https://github.com/nvm-sh/nvm) installed and run `nvm use` in the root directory (which currently
will set the the node version to the latest node v20 - `v20.8.0`, defined in the `.nvmrc` file). Then
run `npm install` to obtain the root dependencies, and `npm i serverless -g` to globally install
[Serverless](https://www.serverless.com/) for this version of node. When switching to any of the directories,
you will need to run `npm install` again.

Verify that you have version 3 of serverless by running `serverless -v` the output should similar to the following:

```shell
pjayarajan@AUM-2991CXGG drx-serverless % serverless -v
Running "serverless" from node_modules
Framework Core: 3.38.0 (local) 3.38.0 (global)
Plugin: 7.2.3
SDK: 4.5.1
```

## Local Environment Setup

The APIs use environment variables from **Gitlab** as well as from within the **parameters** sub-folder of each API folder.

- a copy of the Gitlab variables (stored as json files) are downloaded from AWS S3 and need to be copied from the project root to each of the API folders
- the variables-{env}.json file in the API parameters sub-folder needs to be copied to the root of the API folder as variables.json

The APIs also use Redis (specifically AWS ElastiCache) to improve performance.

- in order to develop locally, you will need a tunnel connection to Redis that the local code can connect to

All of the above can be executed with a single npm command, depending on which environment (**dev** or **sit**), and which type of computer you are using (**pc** or **mac**).

First, copy your **AWS Access keys** to a new terminal, eg:

```shell
export AWS_ACCESS_KEY_ID=ASIA....X3HY && export AWS_SECRET_ACCESS_KEY=lOhy....i1nb && export AWS_SESSION_TOKEN=FwoG....iA==
```

Then run one of the following commands from the project root:

```
npm run setup:offline:dev:pc
npm run setup:offline:sit:pc
```

```
npm run setup:offline:dev:mac
npm run setup:offline:sit:mac
```

When connected successfully, the output should similar to:

```shell
> drx-serverless@1.0.0 setup:offline:sit:mac
> ./setup_offline_env.sh sit; npm run redis:connect:sit

Downloading files from S3...

download: s3://cochlear-drx-cx-dev-deployment/config/sit/aws_infra_parameters.json to ./aws_infra_parameters.json
Downloaded aws_infra_parameters.json successfully.

download: s3://cochlear-drx-cx-dev-deployment/config/sit/aws_resource_parameters.json to ./aws_resource_parameters.json
Downloaded aws_resource_parameters.json successfully.

download: s3://cochlear-drx-cx-dev-deployment/config/sit/lambda_common_env_parameters.json to ./lambda_common_env_parameters.json
Downloaded lambda_common_env_parameters.json successfully.

Copying files to sub-folders...

Folder: account

Copied aws_infra_parameters.json to account successfully.
Copied aws_resource_parameters.json to account successfully.
Copied lambda_common_env_parameters.json to account successfully.
Copied variables-sit.json to account/variables.json successfully.

Folder: address

Copied aws_infra_parameters.json to address successfully.
Copied aws_resource_parameters.json to address successfully.
Copied lambda_common_env_parameters.json to address successfully.
Copied variables-sit.json to address/variables.json successfully.

Folder: apiauthorizer

Copied aws_infra_parameters.json to apiauthorizer successfully.
Copied aws_resource_parameters.json to apiauthorizer successfully.
Copied lambda_common_env_parameters.json to apiauthorizer successfully.
Copied variables-sit.json to apiauthorizer/variables.json successfully.

Folder: auth

Copied aws_infra_parameters.json to auth successfully.
Copied aws_resource_parameters.json to auth successfully.
Copied lambda_common_env_parameters.json to auth successfully.
Copied variables-sit.json to auth/variables.json successfully.

Folder: cache-refresh

Copied aws_infra_parameters.json to cache-refresh successfully.
Copied aws_resource_parameters.json to cache-refresh successfully.
Copied lambda_common_env_parameters.json to cache-refresh successfully.
Copied variables-sit.json to cache-refresh/variables.json successfully.

Folder: orders

Copied aws_infra_parameters.json to orders successfully.
Copied aws_resource_parameters.json to orders successfully.
Copied lambda_common_env_parameters.json to orders successfully.
Copied variables-sit.json to orders/variables.json successfully.

Folder: device

Copied aws_infra_parameters.json to device successfully.
Copied aws_resource_parameters.json to device successfully.
Copied lambda_common_env_parameters.json to device successfully.
Copied variables-sit.json to device/variables.json successfully.

Folder: header-footer

Copied aws_infra_parameters.json to header-footer successfully.
Copied aws_resource_parameters.json to header-footer successfully.
Copied lambda_common_env_parameters.json to header-footer successfully.
Copied variables-sit.json to header-footer/variables.json successfully.

Folder: regions

Copied aws_infra_parameters.json to regions successfully.
Copied aws_resource_parameters.json to regions successfully.
Copied lambda_common_env_parameters.json to regions successfully.
Copied variables-sit.json to regions/variables.json successfully.

Folder: uhmenu

Copied aws_infra_parameters.json to uhmenu successfully.
Copied aws_resource_parameters.json to uhmenu successfully.
Copied lambda_common_env_parameters.json to uhmenu successfully.
Copied variables-sit.json to uhmenu/variables.json successfully.

Folder: service-requests

Copied aws_infra_parameters.json to service-requests successfully.
Copied aws_resource_parameters.json to service-requests successfully.
Copied lambda_common_env_parameters.json to service-requests successfully.
Copied variables-sit.json to service-requests/variables.json successfully.

Folder: utils

Copied aws_infra_parameters.json to utils successfully.
Copied aws_resource_parameters.json to utils successfully.
Copied lambda_common_env_parameters.json to utils successfully.
Copied variables-sit.json to utils/variables.json successfully.


> drx-serverless@1.0.0 redis:connect:sit
> aws ssm start-session --target i-05a28f4f65c481dc2 --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{"host":["cochlear-drx-redis-sit-001.cochlear-drx-redis-sit.dskhjc.apse2.cache.amazonaws.com"],"portNumber":["6379"], "localPortNumber":["6379"]}' --region ap-southeast-2


Starting session with SessionId: pjayarajan@cochlear.com-zvwjxqhs62cpt3bwpth7323lxu
Port 6379 opened for sessionId pjayarajan@cochlear.com-zvwjxqhs62cpt3bwpth7323lxu.
Waiting for connections...

```

Note: if there haven't been any connections for a while, the tunnel will be dropped.

You can run one of these commands to re-initiate the Redis connection alone:

```
npm run redis:connect:dev
npm run redis:connect:sit
```

If you are getting connection issues then the AWS credentials may have expired, so get new ones and copy them into the terminal and try again.

## API Authorizor

This acts as an interceptor for all incoming API requests and needs to be running before other APIs are worked on (although there are a few exceptions, eg auth, cache-refresh, header-footer).

Open a new terminal and navigate to the `apiauthorizor` directory

First, copy your AWS Access keys to the terminal, eg:

```shell
export AWS_ACCESS_KEY_ID=ASIA....X3HY && export AWS_SECRET_ACCESS_KEY=lOhy....i1nb && export AWS_SESSION_TOKEN=FwoG....iA==
```

Then, run one of the following commands:

```
npm run serverless:offline:dev:pc
npm run serverless:offline:sit:pc
```

```
npm run serverless:offline:dev:mac
npm run serverless:offline:sit:mac
```

If this starts up correctly, you should see an output similar to the following (**ToDo: fix warnings**):

```shell
> drx-serverless-apiauthorizer@1.0.0 serverless:offline:sit:mac
> SLS_DEBUG=* ENVIRONMENT=sit AWS_REGION=ap-southeast-2 PROJECT_CODE=drx PROVIDER=apiauthorizer DEPLOY_S3_BUCKET=cochlear-drx-cx-dev-deployment CI_PIPELINE_IID=CI_PIPELINE_IID npx serverless offline start --config serverless_offline.yml


Warning: Invalid configuration encountered
  at 'functions.authorizer.kmsKeyArn': unsupported string format

Learn more about configuration validation here: http://slss.io/configuration-validation

Starting Offline at stage sit (ap-southeast-2)

Offline [http for lambda] listening on http://localhost:3001
Function names exposed for local invocation by aws-sdk:
           * authorizer: cochlear-drx-apiauthorizer-sit
```

As described in the output, the API authorizor is now running on port 3001 locally:

- [http://localhost:3001](http://localhost:3001)

All API requests will initially be verified here first.

## Universal Header Menu

This is the backend API for the Universal Header Menu (profile dropdown) - which is displayed as a component at the top of all the Cochlear web pages for authenticated users (with the associated front end code in the project `drx-main`).

Open a new terminal and navigate to the `uhmenu` directory

First, copy your AWS Access keys to the terminal, eg:

```shell
export AWS_ACCESS_KEY_ID=ASIA....X3HY && export AWS_SECRET_ACCESS_KEY=lOhy....i1nb && export AWS_SESSION_TOKEN=FwoG....iA==
```

Then, run one of the following commands:

```
npm run serverless:offline:dev:pc
npm run serverless:offline:sit:pc
```

```
npm run serverless:offline:dev:mac
npm run serverless:offline:sit:mac
```

If this starts up correctly, you should see an output similar to the following:

```shell
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   OPTIONS | http://localhost:3003/drx/v1/contents/menu           │
│   POST    | http://localhost:3003/2015-03-31/functions/CorsUHm   │
│   enuFunction/invocations                                        │
│   GET     | http://localhost:3003/drx/v1/contents/menu           │
│   POST    | http://localhost:3003/2015-03-31/functions/GetHead   │
│   erList/invocations                                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

(node:6735) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.

Please migrate your code to use AWS SDK for JavaScript (v3).
For more information, check the migration guide at https://a.co/7PzMCcy
(Use `node --trace-warnings ...` to show where the warning was created)
Server ready: http://localhost:3003 🚀

```

As described in the output, the API uhmenu is now running on port 3003 locally:

- [http://localhost:3003](http://localhost:3003)

Incoming requests will initially be first verified via the API `apiauthorizor`, and if successful, then handled by the API `uhmenu`.

A similar process can be followed to run the other APIs locally.
