const AWS = require('aws-sdk');

// convertors:
// https://github.com/dherault/serverless-offline/blob/d61dcbee23e615e6e9f86c7d4faaf44f017fc998/src/events/http/createAuthScheme.js#L33
// https://github.com/dherault/serverless-offline/tree/d61dcbee23e615e6e9f86c7d4faaf44f017fc998/src/utils

module.exports = (endpoint, functionKey, method, path) => {
  console.log('localAuthorizer', {
    endpoint,
    functionKey,
    method,
    path
  });

  console.log('-----------');
  console.log(path);

  return {
    getAuthenticateFunction: () => ({
      async authenticate(request, h) {
        try {
          const lambda = new AWS.Lambda({
            apiVersion: '2015-03-31',
            // endpoint needs to be set only if it deviates from the default, e.g. in a dev environment
            // process.env.SOME_VARIABLE could be set in e.g. serverless.yml for provider.environment or function.environment
            endpoint: 'http://localhost:3001'
          });

          const result = await lambda
            .invoke({
              FunctionName: 'cochlear-drx-apiauthorizer-sit',
              InvocationType: 'RequestResponse',
              Payload: JSON.stringify({
                headers: request.headers,
                query: request.query,
                queryStringParameters: request.query,
                // note in api gateway we normally will see account-V1, address-V1, device-V1, orders-V1 etc
                path: `/apigateway-V1${
                  request.path.replace('/v1/patients/me/account', '') === '/'
                    ? ''
                    : request.path.replace('/v1/patients/me/account', '')
                }`,
                httpMethod: request.method,
                resource: path,
                methodArn: 'mocked-arn'
              })
            })
            .promise();

          const resultPayload = JSON.parse(result.Payload);
          console.log('resultPayload', resultPayload);
          console.log(
            'resultPayload.policyDocument.Statement',
            resultPayload.policyDocument.Statement
          );
          if (
            resultPayload === 'Unauthorized' ||
            resultPayload.policyDocument.Statement[0].Effect !== 'Allow'
          ) {
            return h.unauthenticated(new Error('401'), {
              credentials: {
                context: {}
              }
            });
          }

          return h.authenticated({
            credentials: {
              context: resultPayload.context
            }
          });
        } catch (e) {
          console.log('local-authorizer error', e);
        }
      }
    }),
    name: `${functionKey} - ${path} - strategy name`,
    scheme: `${functionKey} - ${path} - scheme`
  };
};
