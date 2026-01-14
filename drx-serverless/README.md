# DRX Serverless

This provides the API backend - primarily for the universal header (i.e. the `drx-main` code). Each directory 
represents an individual API route (or more in some cases). 

The APIs are written using NodeJS v14 with [serverless.com](https://www.serverless.com/). The code is deployed as AWS 
Lambdas using GitLab pipelines (see the `gitlab-ci.yml` file for deployment details).

## API Overview

This is a work in progress - document as you work on an API please :-)

### auth

Provides authentication functionality via [Auth0](https://auth0.com/). When the user clicks `Login` from the universal
header, then initially go to:

- `/authorize` -> `src/handler.login` - collects and returns the Login URL (for Auth0) and returns to the client. Auth0
  then presents the user with a Login Screen and performs the authentication. On successful authentication, the user is
  redirected to the url below and passes an Auth0 code in order to collect a token from:
  - `drx-auth-lambda-dev-login` - associated lambda in the `dev` environment (deployed from the `develop` branch)
- `/token` -> `src/handler.getToken` - takes the Auth0 code from a successfully authenticated user and returns an object
  containing:
  - `access_token` - used with the `Bearer` header to access resources
  - `id_token` - the Auth0 JWT token - used by the authorizer (an interceptor protecting API calls) to verify that the 
  user is authenticated (access will denied to any user who is not authenticated).
  - [https://authnz-dev.cx.nonp.cochlear.cloud/authorize?app=dm&code=some_code](https://authnz-dev.cx.nonp.cochlear.cloud/authorize?app=dm&code=some_code) - 
  The lambda can be accessed directly using the url above (switch the `app` and `code` parameters as appropriate)
  - https://dev.api.cochlear.com/drx/v1/auth/token
  - `drx-auth-lambda-dev-token` - associated lambda in the `dev` environment (deployed from the `develop` branch)
- `/revoke` -> `src/handler.revokeToken` - revokes Auth0 token (i.e. logs user out)
  - `drx-auth-lambda-dev-revoke` - associated lambda in the `dev` environment (deployed from the `develop` branch)

 is:



### apiauthorizer

An interceptor (function) that verify that any incoming API requests are authenticated.

- `src/handler.authenticate` - called before any API call, as a gatekeeper - either Allow or Deny the request. This is 
  done by validating the Auth0 access token (the JWT `id_token` from above), by verifying the token using the associated
  public key certificate for the Auth0 tenant.
  - `cochlear-drx-apiauthorizer-dev` - associated lambda in the `dev` environment (deployed from the `develop` branch)

### uhmenu

The Universal Header Menu API (presumably - docs need completing)

- `/` -> `src/handler.getHeader` - 
  - `drx-uhmenu-lambda-dev-GetHeaderList` - associated lambda in the `dev` environment (deployed from the `develop` 
  branch)
- TODO
  - `drx-uhmenu-lambda-dev-CorsUHmenuFunction` - associated lambda in the `dev` environment (deployed from the `develop`
    branch)

## Developing

Again, this is a work in progress - so add useful notes as/when you come across them.

### Environment Variables

With in most directories, there is a `parameters` directory, that contains a number of JSON files that represent
(publicly available) environment variables. Using `auth` and the `dev` environment as an example, there is the following
file that contains all these variables.

- `variables-dev.json`

Note: this file is a symlink to another file (at the time of writing, `variables-dev.json.auth0`). Add all the variables
required to the symlinked file. You can check with the command (in the `parameters` directory):

```shell
ls -la
```

This will show something like:

```shell
lrwxr-xr-x   1 marc  staff    24 Jun 19 11:53 variables-dev.json -> variables-dev.json.auth0
-rw-r--r--   1 marc  staff  1718 Jun 19 17:43 variables-dev.json.auth0
...
```

You can unlink using:

```shell
unlink variables-dev.json
```

And link again using the following:

```shell
ln -s variables-dev.json.auth0 variables-dev.json
```

These variables are picked up the `handler.js` - in this case the `loadLocalParams` method. Say we have the following
variable in the `variables-dev.json` file:

```json
{
  "auth0Host": "https://cochlear-poc.au.auth0.com"
}
```

This is referenced and set as follows in the `loadLocalParams` method:

```javascript
_paras._auth0_host = env.auth0Host;
```

The associated `serverless.yml` file also needs to be updated - i.e. to use this variable in the `getToken` method, 
we need to do the following:

```yaml
token:
  handler: src/handler.getToken
  kmsKeyArn: ${self:custom.kmsArn}
  environment:
    auth0Host: ${self:custom.vars.auth0Host}
    # ...
```

This is now injected as `params` to the method and can be referenced as follows:

```javascript
params._auth0_host
```
