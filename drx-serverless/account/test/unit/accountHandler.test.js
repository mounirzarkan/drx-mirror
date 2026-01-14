'use strict';
const sinon = require('sinon');
const {expect} = require('chai');
const accountHandler = require('../../src/accountHandler.js');
const controllers = require('../../src/controller/index.js');
const configurations = require('../../src/configuration/index.js');
const constructor = require('../../src/constructor/responsePayloadConstructor.js');

describe('SUITE: accountHandler', () => {
  const getRequestStr = JSON.stringify({
    resource: '/v1/account',
    path: '/dev-drx-account/v1/account',
    httpMethod: 'GET',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJmOTRjOTAyNy03NmQzLTQ4YTEtYjdkZC1lODc5ODNkZjI2NzEiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjMyMDc2MDcsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhZjQwY2ZiOTZjNmI2YzYyNGU3ZWQ0NWJiODA2NDU4ODUyNTNiNDNhYzU4MjIyOTgzZDc0NTUxOTMyZjgyNzUybHFKTSUyQkU2N083alcwa3JpblE3NHJ3eVZPcGRVbE5tNWxLWDZqS0FPdHJnVjlWbWh2Vm0zSzFnTE9nekhyMlZjcWJuRGpibmdRakh0ZFRmRjFKZ29NUGcyUDElMkYlMkJVS3dVMWJrejlJa3ZaUkZnUWRkMDFYZ0RqeGNsbmlsUlZoWWRtdmRtNUx4c2VmNjR3cCUyRkd2dmk4WHBPeUFMS0h4TFUxcmhCaE02QnJGZkElM0Q5ZmFiNDc1NWRkZWRlNzM0NmU1OWFhMDVmMDE5NzM5MzdjZmYxMmQ3Y2ZiNzg4Y2FjMzhiZDA0NjU1ZDg2ZjkxIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6ImRtLGRzLHN0b3JlLHVoIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NhcmVyIjoiW3tcImZpcnN0TmFtZVwiOlwiQW1hbmRhXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifSx7XCJmaXJzdE5hbWVcIjpcIlBldGVyXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifV0iLCJpYXQiOjE2MjMyMTA0OTcsImV4cCI6MTYyNDQyMDA5NywiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiYjM4N2RhNjM5OWQzZmNjZTVlM2YxZGRiZDE5N2RlNzk5ZDNmODUyMTM2YzFhN2JjM2VhZWYxZGZhNTAxODY5YnJhYm8xNlZzQzJkcVFZSEw4eXpScnclM0QlM0RmMGFkY2Y0MGMyNDU1ZTQwMGU1ZTQ5YjcwNmY2ZTdhZWFkZGY0MzY0NDNhNTg2YzNlOTlmNDkyZWIyYjJmNDMwIiwianRpIjoiZmMxYjhkNTUtNTg2Mi00MThhLTkwMmYtNjVjY2Y1YWU0NzgwIn0.d1BaZttl0ZNZsgUWTom81xjz7LIz0MaJX-v25eFYk2NdNn2ljGGb11xlA2p_BzK-y2C94w-yK3uQdh0r_f248UnVsYdGkpnP8j7fj_-8izdQPR6RLw7dHLFAJpP0J-4Oe0swO1HdD9SocDBlPLTzwEktxFQo0DULI5ZFbNU4RFsGZ-NQfEe9PuIaiQZMbPpf2H5UEz8esUZ8ltdZe6zcwDPlPkBqP6OxZre3qHcY_WTyiDjHk-JMJju7Jp-NpDCUsqPtYcUfYf_TlCRcOyeUymOnZ_v0dIhsNSTG_iymMck73eAr1lg4QOHDeTuDT4qMdUhjCYfprnmjP8zJWq_G3w',
      Host: 'authapi.cochlear.com',
      origin: 'https://dmdev.cx.nonp.cochlear.cloud',
      'sec-ch-ua':
        '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
      via: '2.0 ce728907a201ee4bd45e0b0d29cebb4c.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'axLDsvdXb0H-oTbyxbyjoswAiWWfmImJJcsZjo4o8MMd8ey57u-wKA==',
      'X-Amzn-Trace-Id': 'Root=1-60c03bc1-488c6211594a53622419c6e5',
      'X-Forwarded-For': '210.176.152.190, 64.252.187.135',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
      accept: ['application/json, text/plain, */*'],
      'accept-encoding': ['gzip, deflate, br'],
      'accept-language': ['en-US,en;q=0.9'],
      Authorization: [
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJmOTRjOTAyNy03NmQzLTQ4YTEtYjdkZC1lODc5ODNkZjI2NzEiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjMyMDc2MDcsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhZjQwY2ZiOTZjNmI2YzYyNGU3ZWQ0NWJiODA2NDU4ODUyNTNiNDNhYzU4MjIyOTgzZDc0NTUxOTMyZjgyNzUybHFKTSUyQkU2N083alcwa3JpblE3NHJ3eVZPcGRVbE5tNWxLWDZqS0FPdHJnVjlWbWh2Vm0zSzFnTE9nekhyMlZjcWJuRGpibmdRakh0ZFRmRjFKZ29NUGcyUDElMkYlMkJVS3dVMWJrejlJa3ZaUkZnUWRkMDFYZ0RqeGNsbmlsUlZoWWRtdmRtNUx4c2VmNjR3cCUyRkd2dmk4WHBPeUFMS0h4TFUxcmhCaE02QnJGZkElM0Q5ZmFiNDc1NWRkZWRlNzM0NmU1OWFhMDVmMDE5NzM5MzdjZmYxMmQ3Y2ZiNzg4Y2FjMzhiZDA0NjU1ZDg2ZjkxIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6ImRtLGRzLHN0b3JlLHVoIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NhcmVyIjoiW3tcImZpcnN0TmFtZVwiOlwiQW1hbmRhXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifSx7XCJmaXJzdE5hbWVcIjpcIlBldGVyXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifV0iLCJpYXQiOjE2MjMyMTA0OTcsImV4cCI6MTYyNDQyMDA5NywiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiYjM4N2RhNjM5OWQzZmNjZTVlM2YxZGRiZDE5N2RlNzk5ZDNmODUyMTM2YzFhN2JjM2VhZWYxZGZhNTAxODY5YnJhYm8xNlZzQzJkcVFZSEw4eXpScnclM0QlM0RmMGFkY2Y0MGMyNDU1ZTQwMGU1ZTQ5YjcwNmY2ZTdhZWFkZGY0MzY0NDNhNTg2YzNlOTlmNDkyZWIyYjJmNDMwIiwianRpIjoiZmMxYjhkNTUtNTg2Mi00MThhLTkwMmYtNjVjY2Y1YWU0NzgwIn0.d1BaZttl0ZNZsgUWTom81xjz7LIz0MaJX-v25eFYk2NdNn2ljGGb11xlA2p_BzK-y2C94w-yK3uQdh0r_f248UnVsYdGkpnP8j7fj_-8izdQPR6RLw7dHLFAJpP0J-4Oe0swO1HdD9SocDBlPLTzwEktxFQo0DULI5ZFbNU4RFsGZ-NQfEe9PuIaiQZMbPpf2H5UEz8esUZ8ltdZe6zcwDPlPkBqP6OxZre3qHcY_WTyiDjHk-JMJju7Jp-NpDCUsqPtYcUfYf_TlCRcOyeUymOnZ_v0dIhsNSTG_iymMck73eAr1lg4QOHDeTuDT4qMdUhjCYfprnmjP8zJWq_G3w'
      ],
      Host: ['authapi.cochlear.com'],
      origin: ['https://dmdev.cx.nonp.cochlear.cloud'],
      'sec-ch-ua': [
        '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"'
      ],
      'sec-ch-ua-mobile': ['?0'],
      'sec-fetch-dest': ['empty'],
      'sec-fetch-mode': ['cors'],
      'sec-fetch-site': ['cross-site'],
      'User-Agent': [
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
      ],
      via: ['2.0 ce728907a201ee4bd45e0b0d29cebb4c.cloudfront.net (CloudFront)'],
      'X-Amz-Cf-Id': [
        'axLDsvdXb0H-oTbyxbyjoswAiWWfmImJJcsZjo4o8MMd8ey57u-wKA=='
      ],
      'X-Amzn-Trace-Id': ['Root=1-60c03bc1-488c6211594a53622419c6e5'],
      'X-Forwarded-For': ['210.176.152.190, 64.252.187.135'],
      'X-Forwarded-Port': ['443'],
      'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
      id: 'b387da6399d3fcce5e3f1ddbd197de799d3f852136c1a7bc3eaef1dfa501869brabo16VsC2dqQYHL8yzRrw==f0adcf40c2455e400e5e49b706f6e7aeaddf436443a586c3e99f492eb2b2f430'
    },
    multiValueQueryStringParameters: {
      id: [
        'b387da6399d3fcce5e3f1ddbd197de799d3f852136c1a7bc3eaef1dfa501869brabo16VsC2dqQYHL8yzRrw==f0adcf40c2455e400e5e49b706f6e7aeaddf436443a586c3e99f492eb2b2f430'
      ]
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: 'wmgzfb',
      authorizer: {
        sub: '162748173278165',
        lastName: 'Ward',
        principalId:
          '96a32b4e3d543f2ca2942d55347ab59296a0ab3693b6d94d9d625404c05dc2b6xNlAhZrlnKRNpHa0gGzSpQ%3D%3D1bdff8eb88e01bd5c0925a633fc9ef70f8c89edb3fc2f3ddf948a75b37c65e3e',
        integrationLatency: 1039,
        locale: 'en_US',
        sid: 'f94c9027-76d3-48a1-b7dd-e87983df2671',
        firstName: 'masked by logUtils',
        countryCode: 'US',
        obj: '162748173278165',
        auth_time: '1623207607',
        sf_token:
          '00D3E000000B9Ct!AQkAQLOaWNS9.SgACyYEiSWfsyO1RxrJ_HdPydMXVnpYzhiiFWsQif17YpBupDGD32NYkVTBCqnI1YcnqHRV2r.iDeTU3nT6',
        jwtToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJmOTRjOTAyNy03NmQzLTQ4YTEtYjdkZC1lODc5ODNkZjI2NzEiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjMyMDc2MDcsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJjMDk0NDY4OTUzNDg5NGY1MzE3ZDZkODZiMTY2MDBlMzk0ZDAxNjYzYzYzMzczZTg1MmNjNzVjMDM3NmYwYzdiVTRNbVlMb3hvQWRyREU4QWhGdzBjVG9jUzYxTDI4JTJCTVdLYyUyQlhyaW9xZ1NIdVAlMkY3U2RXZjk4d05sSzBSOGJSTk5QT2ZlbzdmWURPQnNyQiUyQjlmb0p4ZTU0UzVFRlJJYkElMkZVZjdvcWwyNHlOQ1NVTkVwVWlwcVhRS1pzSzFsQlVKNHdrU2NLdFJqekpMJTJGbG5qJTJCN3ptTzRFeGllNCUyQlY3cFhqMm8lMkJzMTd5UiUyRlklM0Q1MDEyMTkwZDg4YWM1ZjFmNmRmYTFmMTc2M2M5YTU0Mjc1ZmMxZTg3YTYxMTYzMTViZTRkYmE0NmNlNWQ5NWFmIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6ImRtLGRzLHN0b3JlLHVoIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NhcmVyIjoiW3tcImZpcnN0TmFtZVwiOlwiQW1hbmRhXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifSx7XCJmaXJzdE5hbWVcIjpcIlBldGVyXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifV0iLCJpYXQiOjE2MjMyMTA5NDYsImV4cCI6MTYyNDQyMDU0NiwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiNmI3NjU5YzE3MDdlNGRjNTliYWVmYWRjYTU1Njg4NTNhNGIwNWM0NmI2NDZlYjgwYzMzZGQ1YmUyYWY2YzY5ZXgyUCUyRjVoNnZSM3V4aTBEdzJKZE5jdyUzRCUzRGVjYzYxNzA3MjFjMjRiNzIxOTk3MDZjZjJlN2IzNTUzYzBiZTU1YmYxZTNhNTUzOWFkODdiZDM2YjY1NTRmODMiLCJqdGkiOiIwNGM0NWI0MS02OWUzLTRiZGUtYjA2NS0zZTljYWRlYThiMzIifQ.JeVtSKScLet50JsYyh62mx2Ru6K1kbdlgUbhsI8lNEd6vWTrE3GIkf_rauVOInR5Dws6tvBJuD7DegUMD1y5doYWwr3plybHQkyK3caHecSJbVAU6jh8JxJXh61GbxrQ5NPhIASqmoTH__6ZweGKmWby4SQavTb75KTlJPwnSwvJErZKdlsb7k64PlJ-fu9hRglG2URUUTFEXpL0Qr_wcbeZYtRlH2sJ5KntfHaiiQyTI_P4VL7tItjPNMsNKg592ysz7kWTudFJata-ri6rsMU2jEJb2kb6ydO1vm4_-gErvmRrF192YE69Al6te1mZhDqqwmKXZelENUdSqE8EPQ',
        userType: 'Recipient'
      },
      resourcePath: '/v1/account',
      httpMethod: 'GET',
      extendedRequestId: 'Ao5GVEW_SwMFWUQ=',
      requestTime: '09/Jun/2021:03:55:45 +0000',
      path: '/dev-drx-account/v1/account',
      accountId: '094551496269',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: 'authapi',
      requestTimeEpoch: 1623210945958,
      requestId: '30aaeb10-0021-447c-959e-d94aa5afc396',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '64.252.187.135',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
        user: null
      },
      domainName: 'authapi.cochlear.com',
      apiId: 'frd9364ahb'
    },
    body: null,
    isBase64Encoded: false
  });

  const patchRequestStr = JSON.stringify({
    resource: '/v1/address',
    path: '/dev-drx-address/v1/address',
    httpMethod: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwZjVkZDU2Ni02YjY5LTRhODItYjA5Ni1mMmY0YmUzOTExYTkiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjI3NjIzMDIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJkMWZjNjBkZjZmMzAyZmI2YTYyYWVkMGE2MWJiYmUyZjhmNzExMDNlY2RlYzIzMjRjNWViMGQyNTkxMWUxOTQ2R2tPVVRqZlNOQVZmbjFiang1Z1lSWHBJQ2VpRWFxN3hIQVNrbE8yRE01YTdxd0pRVWwzQlJsT1ppNCUyQlEyWWJhWG1MdUxTWVlrclJQZUVuWTRNaFNnM1FSbVJZdG4wbDlkRVozaVA0cDFwY1IwMDFvOUxNUzlSRDRRNFdYN1h6dTljazV0bTd2NTcxbnI5d2xJVDJLaTF4bnBJcFpHYSUyQllHYVNYSHRZbTVOdyUzRDg3ZjYxNDRmNDNiMWZiYWRiYzQ4YmIwNDE2ODc0ZjU0ZTg1MmFmMmQ0MTBiNDI2YjYyM2Q1MjI1Yjk5OWViODUiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vYXBwIjoiZG0sZHMsc3RvcmUsdWgiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vY2FyZXIiOiJbe1wiZmlyc3ROYW1lXCI6XCJBbWFuZGFcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9LHtcImZpcnN0TmFtZVwiOlwiUGV0ZXJcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9XSIsImlhdCI6MTYyMjc2MjMwOCwiZXhwIjoxNjIzOTcxOTA4LCJpc3MiOiJodHRwczovL3d3dy5jb2NobGVhci5jb20iLCJzdWIiOiIzNDUwNDU1ZGMyMTg5OGI2NWVhZmFmZDJkMjE2MDRjOTViNjI5NThiNTBjMDg3ZmMzYWVjOWY3OGE2MjhlNTFjdUo5cGtrRm1nZWNWT3FxeGduZUNKUSUzRCUzRGM0NzMxMjc2NDIwYTc2MTlmZDg0NmY2ZDczN2E0ZDJlMDc4YTE1MWIyOTBmYWVjZmIxYjdkMWQ4MzcxNGZkYzAiLCJqdGkiOiIzM2VmNGNjYi1lNTZhLTQ5ZjctOWM0My02MjJlZTVmZWY5MDgifQ.S5p9TkPZ0GroRYb8CdT1FfHnKIu9AXGN1K3vWMiajeXSaMLVUVpQ4fj3ac6Mxmgk-B_ckISBSW6MbrGQzVBnOJpttv1v7bQVy140P6Tp3lnK9n_O61F-jZ5WEVKtnfuOqaRkVnc2DRmR4_7k2Zr4wNTtU3vCoEmylO5tWDQSoJWOz9KUHNKF6IpodSdPh6-5gaYYYgBo3jED-ShVczhY2d6RaEfMZLyd6Lc955DDY70k3GpXNlg6VcAm_eWVjXmz4UKwaOYYHOWpMNmiEpVpY4p-WDowbARC1iTqmjPH_FF5Jrr8VwQcx13j9B7BPeEc8el11B2qT3KKLD691EtVWA',
      'content-type': 'application/json;charset=UTF-8',
      Host: 'authapi.cochlear.com',
      origin: 'https://dmdev.cx.nonp.cochlear.cloud',
      'sec-ch-ua':
        '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
      via: '2.0 41f4e34e5d78c923aead0fa16ff91eb9.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'nIxY8kSNF_IZpBJmI9m3AjMvqv3CGX6l390frlOSXMtK0eJ0upKWkA==',
      'X-Amzn-Trace-Id': 'Root=1-60b96364-3edebc6b63d7084a7200bd8a',
      'X-Forwarded-For': '103.149.202.18, 64.252.187.80',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
      accept: ['application/json, text/plain, */*'],
      'accept-encoding': ['gzip, deflate, br'],
      'accept-language': ['en-US,en;q=0.9'],
      Authorization: [
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwZjVkZDU2Ni02YjY5LTRhODItYjA5Ni1mMmY0YmUzOTExYTkiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjI3NjIzMDIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJkMWZjNjBkZjZmMzAyZmI2YTYyYWVkMGE2MWJiYmUyZjhmNzExMDNlY2RlYzIzMjRjNWViMGQyNTkxMWUxOTQ2R2tPVVRqZlNOQVZmbjFiang1Z1lSWHBJQ2VpRWFxN3hIQVNrbE8yRE01YTdxd0pRVWwzQlJsT1ppNCUyQlEyWWJhWG1MdUxTWVlrclJQZUVuWTRNaFNnM1FSbVJZdG4wbDlkRVozaVA0cDFwY1IwMDFvOUxNUzlSRDRRNFdYN1h6dTljazV0bTd2NTcxbnI5d2xJVDJLaTF4bnBJcFpHYSUyQllHYVNYSHRZbTVOdyUzRDg3ZjYxNDRmNDNiMWZiYWRiYzQ4YmIwNDE2ODc0ZjU0ZTg1MmFmMmQ0MTBiNDI2YjYyM2Q1MjI1Yjk5OWViODUiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vYXBwIjoiZG0sZHMsc3RvcmUsdWgiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vY2FyZXIiOiJbe1wiZmlyc3ROYW1lXCI6XCJBbWFuZGFcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9LHtcImZpcnN0TmFtZVwiOlwiUGV0ZXJcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9XSIsImlhdCI6MTYyMjc2MjMwOCwiZXhwIjoxNjIzOTcxOTA4LCJpc3MiOiJodHRwczovL3d3dy5jb2NobGVhci5jb20iLCJzdWIiOiIzNDUwNDU1ZGMyMTg5OGI2NWVhZmFmZDJkMjE2MDRjOTViNjI5NThiNTBjMDg3ZmMzYWVjOWY3OGE2MjhlNTFjdUo5cGtrRm1nZWNWT3FxeGduZUNKUSUzRCUzRGM0NzMxMjc2NDIwYTc2MTlmZDg0NmY2ZDczN2E0ZDJlMDc4YTE1MWIyOTBmYWVjZmIxYjdkMWQ4MzcxNGZkYzAiLCJqdGkiOiIzM2VmNGNjYi1lNTZhLTQ5ZjctOWM0My02MjJlZTVmZWY5MDgifQ.S5p9TkPZ0GroRYb8CdT1FfHnKIu9AXGN1K3vWMiajeXSaMLVUVpQ4fj3ac6Mxmgk-B_ckISBSW6MbrGQzVBnOJpttv1v7bQVy140P6Tp3lnK9n_O61F-jZ5WEVKtnfuOqaRkVnc2DRmR4_7k2Zr4wNTtU3vCoEmylO5tWDQSoJWOz9KUHNKF6IpodSdPh6-5gaYYYgBo3jED-ShVczhY2d6RaEfMZLyd6Lc955DDY70k3GpXNlg6VcAm_eWVjXmz4UKwaOYYHOWpMNmiEpVpY4p-WDowbARC1iTqmjPH_FF5Jrr8VwQcx13j9B7BPeEc8el11B2qT3KKLD691EtVWA'
      ],
      'content-type': ['application/json;charset=UTF-8'],
      Host: ['authapi.cochlear.com'],
      origin: ['https://dmdev.cx.nonp.cochlear.cloud'],
      'sec-ch-ua': [
        '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"'
      ],
      'sec-ch-ua-mobile': ['?0'],
      'sec-fetch-dest': ['empty'],
      'sec-fetch-mode': ['cors'],
      'sec-fetch-site': ['cross-site'],
      'User-Agent': [
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
      ],
      via: ['2.0 41f4e34e5d78c923aead0fa16ff91eb9.cloudfront.net (CloudFront)'],
      'X-Amz-Cf-Id': [
        'nIxY8kSNF_IZpBJmI9m3AjMvqv3CGX6l390frlOSXMtK0eJ0upKWkA=='
      ],
      'X-Amzn-Trace-Id': ['Root=1-60b96364-3edebc6b63d7084a7200bd8a'],
      'X-Forwarded-For': ['103.149.202.18, 64.252.187.80'],
      'X-Forwarded-Port': ['443'],
      'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: '4v8gm5',
      authorizer: {
        obj: '162748173278165',
        sub: '162748173278165',
        lastName: 'Ward',
        principalId:
          '6d0de94c468e83ae9ff5da75b2392463c28c40c59bd9d77461f71b0694196f5eQdGV6BxMv0LMC7yqXx3KIg%3D%3Dd89b4ccf02bd3de8c82a9356cfdada0c6825a76004feada706f63b14014ebde9',
        integrationLatency: 472,
        locale: 'en_US',
        sid: '0f5dd566-6b69-4a82-b096-f2f4be3911a9',
        firstName: 'masked by logUtils',
        countryCode: 'US',
        auth_time: '1622762302',
        sf_token:
          '00D3E000000B9Ct!AQkAQEMIaLglZeFFk9hjo67k3i_3hUBjNpnkQRxYDugozfSCoQ6PnW.x6.7Em5LUaFqGk__1dc.Ne3EuRBnE_pbkBWRnXURU',
        jwtToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwZjVkZDU2Ni02YjY5LTRhODItYjA5Ni1mMmY0YmUzOTExYTkiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjI3NjIzMDIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhM2EwNGRkMTQ1ZGEzZTNjZDUxNGFhYzA3MGIyNWZjMWI3NDk2YWYzY2IwMjZjYjg1NDJmZTBkZjYwMzU2MjY4NzZVM1FEcnVvS0FvZ0xVNGlFOFdoOWRTeVFqOVQ3WFJ6cFRPTEtic1VuaUNEUlZ6YzNPbkNxSml0MDRTeXF6NEt1Qkd2N3dYR1gxM2VMaFdSUHNNWGg5UllIaU1xRU0lMkJLeExCSU10JTJGbEFleGhUZ2VXRjBjcm5wTjZ4SlpKcmp0c1klMkY3TVEzU3MlMkJDa2JXYzJob2lpdElNdWN4TGN6QWNrZXNpTldobkMzNGMlM0RiMTNiY2E4MGI5ODI5MzIzNDdiMGZkNmVmZTRhMzk5YzBkYzY2NTRiODg2ZWQ3Yzk5YjdmYjQ2ZGQ0YzNjYTA4IiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6ImRtLGRzLHN0b3JlLHVoIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NhcmVyIjoiW3tcImZpcnN0TmFtZVwiOlwiQW1hbmRhXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifSx7XCJmaXJzdE5hbWVcIjpcIlBldGVyXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifV0iLCJpYXQiOjE2MjI3NjIzNDEsImV4cCI6MTYyMzk3MTk0MSwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiYTI0MWY1MDE1YTJlMzQ3OGQzOTk3MjU2YjUxOTI1NGE1MzY0ZDMxYWQ0YjkwYjM2NmE1M2E0NzgzMjBjYTg2NTdCJTJCc2U3WDFjY3ZKWUNwMHlhS0xLdyUzRCUzRDZhMDIyZTc0YTczZGUyNzdhMWQ0YTc0MTYyZDkxZWI5MDAyZTM4YjM2ZTQwOWIzMjhjZmQ4MTA4N2YyY2E1OWQiLCJqdGkiOiI5ODEzNzNhNy03YzE2LTRhMTktODhiMC0xNjgzMTc3OWI1MWMifQ.F0Zui4p5mjKx5DuezBiA6QonqRnq6u0cmmQTN5e8BNp2fxRhFq0GsCtBe1rYPf_CyNeDyYH0ilUHr8UOwvG29RwcMOZMczLAfImp1ZL7z-uScgBaR7AqpV5KCWQ8GJWc04TPmwABWYJFO5-pe8seA-vBLjMdR4lFafFjkU9Dm7Z_6gTlZWJbjqc0S_S4bo05zRtyYv8nACKBUvOMsUp9j-TR6f8g8zZU--DK-607Q8hX4JljnOq_oJgc4zdnekyh_r9-D90QlgDLYA4Q585Bt0-ryAYYicdiHjVvrQM652Vp2JNvEL_UloP0fb8YOzSYXOEY5P5qMqERmBcdyH-vPg',
        userType: 'Recipient'
      },
      resourcePath: '/v1/address',
      httpMethod: 'POST',
      extendedRequestId: 'AXx3yGEWSwMFTBQ=',
      requestTime: '03/Jun/2021:23:19:00 +0000',
      path: '/dev-drx-address/v1/address',
      accountId: '094551496269',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: 'authapi',
      requestTimeEpoch: 1622762340811,
      requestId: '92b91350-9f44-46ed-9380-052cf83de625',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '64.252.187.80',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
        user: null
      },
      domainName: 'authapi.cochlear.com',
      apiId: 'wc0p9almlf'
    },
    body: '{"modifiedByApp":"drx","customerIdentifier":"3450455dc21898b65eafafd2d21604c95b62958b50c087fc3aec9f78a628e51cuJ9pkkFmgecVOqqxgneCJQ%3D%3Dc4731276420a7619fd846f6d737a4d2e078a151b290faecfb1b7d1d83714fdc0","addressId":"a0H7Y000005GBX4UAO","street1":"22 on the Grn","street2":"","street3":"","street4":null,"city":"Verbank","state":"NY","postalCode":"12585-5115","countryIso2Code":"US"}',
    isBase64Encoded: false
  });
  const accountControllerRArespStr = JSON.stringify({
    account: {
      _metadata: {readOnlyForm: false},
      firstName: {value: 'Amanda', permission: 'rw'},
      lastName: {value: 'Ward', permission: 'rw'},
      email: {value: 'new@cochlear.com', permission: 'rw'},
      dateOfBirth: {value: '1991-09-30', permission: 'rw'},
      familyConsent: {value: 'Given', permission: 'r'},
      phones: {
        value: [
          {
            type: 'Mobile',
            phoneNumber: '+1222222223',
            ocSms: 'Given',
            isValid: true,
            isPrimary: false
          },
          {
            type: 'Mobile',
            phoneNumber: '+12121112212',
            ocSms: null,
            isValid: true,
            isPrimary: false
          },
          {
            type: 'Mobile',
            phoneNumber: '+1893636116',
            ocSms: null,
            isValid: true,
            isPrimary: true
          }
        ],
        permission: 'rw'
      },
      relatedCarers: {value: ['Peter Ward'], permission: 'r'}
    }
  });
  const getAccountResponseStr = JSON.stringify({
    statusCode: 200,
    body: '{"success":true,"data":{"account":{"_metadata":{"readOnlyForm":false},"firstName":{"value":"Amanda","permission":"rw"},"lastName":{"value":"Ward","permission":"rw"},"email":{"value":"new@cochlear.com","permission":"rw"},"dateOfBirth":{"value":"1991-09-30","permission":"rw"},"familyConsent":{"value":"Given","permission":"r"},"phones":{"value":[{"type":"Mobile","phoneNumber":"+1222222223","ocSms":"Given","isValid":true,"isPrimary":false},{"type":"Mobile","phoneNumber":"+12121112212","ocSms":null,"isValid":true,"isPrimary":false},{"type":"Mobile","phoneNumber":"+1893636116","ocSms":null,"isValid":true,"isPrimary":true}],"permission":"rw"},"relatedCarers":{"value":["Peter Ward"],"permission":"r"}}}}',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwZjVkZDU2Ni02YjY5LTRhODItYjA5Ni1mMmY0YmUzOTExYTkiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjI3NjIzMDIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiIzNDRkODk5MTRhZmQyNjFjYzAzOGViODA2NGYxNmU2M2JkMTI1MWE4NmJmYTdlZjVhYWE4ZmMzYjZkYWRmYTczJTJCdmFTTUZJR2dndm9yMWY0MktienBnTFYlMkJTUEVOREhJM1RYN1RYSHNOVlRiMyUyRjElMkIzeTU4dCUyRjRacnF4ODNpajQ1UmY3VmtvRWhyS28zQVRLdEVQT3BrbVpKaU9ncFA5RUJPRHkyZDhBbzQ5SnQlMkZWZ0Z6ZjJhYVhBN3FYcmpZYyUyQms5V013U09iJTJGWmF4b1pabHdMTVdJNGFFdnJhTnA1RFczZ2NEaUZyR2R3RSUzRGQzNmQ0MDdkNTVhMmZmMzJjOTQ1OWY1OWIwODhmMTA0YmQ1NGI5YTM3MTNiNzQyMjI3ZjVhZTUwZDEwNTUxNDEiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vYXBwIjoiZG0sZHMsc3RvcmUsdWgiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vY2FyZXIiOiJbe1wiZmlyc3ROYW1lXCI6XCJBbWFuZGFcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9LHtcImZpcnN0TmFtZVwiOlwiUGV0ZXJcIixcImxhc3ROYW1lXCI6XCJXYXJkXCJ9XSIsImlhdCI6MTYyMjc2MjMxOCwiZXhwIjoxNjIzOTcxOTE4LCJpc3MiOiJodHRwczovL3d3dy5jb2NobGVhci5jb20iLCJzdWIiOiI5NTU2NTUxOTcwMWQ1ZDA3ZDE4MTA4ZWNiZGIxMTExMWI2NWNlMTQ3NmYxNjhhZDU2ZjRmNWU2MTZhMTA1M2Rla1pyNHlxSEVqdyUyRlI5M2h6bXR3S3lnJTNEJTNENjNhZGJmMGEzYWNhNWQyMjI0NDM3NWNmNjhkNjczMjQ1MDJiYTAwZmFmNjVjZTViMTg0NWU4ZjYwMTZkNDhkNiIsImp0aSI6IjU0MDE4ZmM5LTZmZDItNGRmNC05MGY3LTU0NWM4OWZjNjhkMSJ9.RgnA8DKGZBgOhTow4EQEQTwnX3xpfAy-sEaTk7Lc0OxZIMayvtWHdlxAczVOh_qI64_rTEvNs9aK34-V1CSHrDQ3SKHom2giHELjU96TqtyzoTgIe9LnCMXuiI03Qbi8XTpw6M2aI2o8RduBwnwixSen6QQi2daZSVMRB15xWYdh8abWnTMEE0UhenzsYnDBu1xvmeortT2rrWQiNpdyWN391vBSP7WEhYDe91yzYf8jmZDMIiqU3T3LxSU04EeIU4cU5DhNBX3YroIy1kffXX9tAsBQfL0Pnv5HOKqCbyf7WGgBIH8zZVXteZiXCBm9B03nE06CHT4lXVqmYzNtYQ'
    }
  });

  const patchAccountRespStr = JSON.stringify({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIwZjVkZDU2Ni02YjY5LTRhODItYjA5Ni1mMmY0YmUzOTExYTkiLCJnaXZlbl9uYW1lIjoiQW1hbmRhIiwiZmFtaWx5X25hbWUiOiJXYXJkIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2MjI3NjIzMDIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhM2EwNGRkMTQ1ZGEzZTNjZDUxNGFhYzA3MGIyNWZjMWI3NDk2YWYzY2IwMjZjYjg1NDJmZTBkZjYwMzU2MjY4NzZVM1FEcnVvS0FvZ0xVNGlFOFdoOWRTeVFqOVQ3WFJ6cFRPTEtic1VuaUNEUlZ6YzNPbkNxSml0MDRTeXF6NEt1Qkd2N3dYR1gxM2VMaFdSUHNNWGg5UllIaU1xRU0lMkJLeExCSU10JTJGbEFleGhUZ2VXRjBjcm5wTjZ4SlpKcmp0c1klMkY3TVEzU3MlMkJDa2JXYzJob2lpdElNdWN4TGN6QWNrZXNpTldobkMzNGMlM0RiMTNiY2E4MGI5ODI5MzIzNDdiMGZkNmVmZTRhMzk5YzBkYzY2NTRiODg2ZWQ3Yzk5YjdmYjQ2ZGQ0YzNjYTA4IiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6ImRtLGRzLHN0b3JlLHVoIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NhcmVyIjoiW3tcImZpcnN0TmFtZVwiOlwiQW1hbmRhXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifSx7XCJmaXJzdE5hbWVcIjpcIlBldGVyXCIsXCJsYXN0TmFtZVwiOlwiV2FyZFwifV0iLCJpYXQiOjE2MjI3NjIzNDEsImV4cCI6MTYyMzk3MTk0MSwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiYTI0MWY1MDE1YTJlMzQ3OGQzOTk3MjU2YjUxOTI1NGE1MzY0ZDMxYWQ0YjkwYjM2NmE1M2E0NzgzMjBjYTg2NTdCJTJCc2U3WDFjY3ZKWUNwMHlhS0xLdyUzRCUzRDZhMDIyZTc0YTczZGUyNzdhMWQ0YTc0MTYyZDkxZWI5MDAyZTM4YjM2ZTQwOWIzMjhjZmQ4MTA4N2YyY2E1OWQiLCJqdGkiOiI5ODEzNzNhNy03YzE2LTRhMTktODhiMC0xNjgzMTc3OWI1MWMifQ.F0Zui4p5mjKx5DuezBiA6QonqRnq6u0cmmQTN5e8BNp2fxRhFq0GsCtBe1rYPf_CyNeDyYH0ilUHr8UOwvG29RwcMOZMczLAfImp1ZL7z-uScgBaR7AqpV5KCWQ8GJWc04TPmwABWYJFO5-pe8seA-vBLjMdR4lFafFjkU9Dm7Z_6gTlZWJbjqc0S_S4bo05zRtyYv8nACKBUvOMsUp9j-TR6f8g8zZU--DK-607Q8hX4JljnOq_oJgc4zdnekyh_r9-D90QlgDLYA4Q585Bt0-ryAYYicdiHjVvrQM652Vp2JNvEL_UloP0fb8YOzSYXOEY5P5qMqERmBcdyH-vPg'
    }
  });

  it('CASE: getUserInfo calls getAccount with 200 status code', async () => {
    sinon.stub(controllers, 'AccountController').returns(
      new (class {
        constructor() {}
        async getAccount() {
          return JSON.parse(accountControllerRArespStr);
        }
      })()
    );
    sinon.stub(configurations, 'EnvironmentConfiguration').returns(
      new (class {
        constructor() {}
        async init() {}
        isTestEnvironment() {
          return false;
        }
        isLocal() {
          return false;
        }
      })()
    );
    sinon
      .stub(constructor, 'getResponse')
      .withArgs(200)
      .returns(JSON.parse(getAccountResponseStr))
      .withArgs()
      .returns({});
    sinon.stub(constructor, 'getErrorResponse').returns({});

    await accountHandler.getUserInfo(JSON.parse(getRequestStr), {});

    expect(constructor.getResponse.getCall(0))
      .to.have.nested.property('args[0]')
      .and.equal(200);
    expect(constructor.getErrorResponse).with.property('callCount').to.equal(0);
  });

  it('CASE: getUserInfo returns getAddressResponse', async () => {
    sinon.stub(controllers, 'AccountController').returns(
      new (class {
        constructor() {}
        async getAccount() {
          return JSON.parse(accountControllerRArespStr);
        }
      })()
    );
    sinon.stub(configurations, 'EnvironmentConfiguration').returns(
      new (class {
        constructor() {}
        async init() {}
        isTestEnvironment() {
          return false;
        }
        isLocal() {
          return false;
        }
      })()
    );
    sinon
      .stub(constructor, 'getResponse')
      .withArgs(200)
      .returns(JSON.parse(getAccountResponseStr))
      .withArgs()
      .returns({});
    sinon.stub(constructor, 'getErrorResponse').returns({});

    const resp = await accountHandler.getUserInfo(
      JSON.parse(getRequestStr),
      {}
    );

    expect(resp).to.deep.equal(JSON.parse(getAccountResponseStr));
  });

  it('CASE: patchUserInfo calls getResponse with 200 status code', async () => {
    sinon.stub(controllers, 'AccountController').returns(
      new (class {
        constructor() {}
        async patchAccount() {}
      })()
    );
    sinon.stub(configurations, 'EnvironmentConfiguration').returns(
      new (class {
        constructor() {}
        async init() {}
        isTestEnvironment() {
          return false;
        }
        isLocal() {
          return false;
        }
      })()
    );

    const expectedResponse = JSON.parse(patchAccountRespStr);
    expectedResponse.body = undefined;

    sinon
      .stub(constructor, 'getResponse')
      .withArgs(200)
      .returns(expectedResponse)
      .withArgs()
      .returns({});
    sinon.stub(constructor, 'getErrorResponse').returns({});

    await accountHandler.patchUserInfo(JSON.parse(patchRequestStr), {});

    expect(constructor.getResponse.getCall(0))
      .to.have.nested.property('args[0]')
      .and.equal(200);
    expect(constructor.getErrorResponse).with.property('callCount').to.equal(0);
  });

  it('CASE: patchAccount return expectedPostAddress', async () => {
    sinon.stub(controllers, 'AccountController').returns(
      new (class {
        constructor() {}
        async patchAccount() {}
      })()
    );
    sinon.stub(configurations, 'EnvironmentConfiguration').returns(
      new (class {
        constructor() {}
        async init() {}
        isTestEnvironment() {
          return false;
        }
        isLocal() {
          return false;
        }
      })()
    );

    const expectedResponse = JSON.parse(patchAccountRespStr);
    expectedResponse.body = undefined;

    sinon
      .stub(constructor, 'getResponse')
      .withArgs(200)
      .returns(expectedResponse)
      .withArgs()
      .returns({});
    sinon.stub(constructor, 'getErrorResponse').returns({});

    const resp = await accountHandler.patchUserInfo(
      JSON.parse(patchRequestStr),
      {}
    );

    expect(resp).to.deep.equal(expectedResponse);
  });

  afterEach(() => {
    sinon.restore();
  });
});
