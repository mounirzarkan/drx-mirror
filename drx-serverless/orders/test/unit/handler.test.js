'use strict';
const sinon = require('sinon');
const { expect } = require('chai');

const { getOrderHeaders, getOrderLines } = require('../../src/handler.js');
const configurations = require('../../src/configuration/index.js');
//const ordersController = require('../../src/controller/ordersController.js');
const controllers = require('../../src/controller/index.js');

const { utils } = require('../../src/util/index.js');
const jwtHelpers = require('../../src/util/jwtHelpers.js');

// TODO checkout why this is failing
describe('SUITE: handler', () => {
  let orderHeadersStr = undefined;
  let orderLinesStr = undefined;
  const getCachePartyId = sinon.fake.resolves(2222222);
  const getCachePartyIdEmpty = sinon.fake.resolves(undefined);

  const cache = {
    get: getCachePartyId
  };
  const requestContext = {
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
    }
  };
  beforeEach(() => {
    sinon.stub(configurations, 'EnvironmentConfiguration').returns(
      new (class {
        constructor() {
          (this.region = 'region'),
            (this.secretName = 'cochlear-drx-dev-orders'),
            (this.env = 'Environment'),
            (this.redisTokenKey = 'redisTokenKey'),
            (this.redisPort = 'RedisPort'),
            (this.redisHost = 'RedisHostname'),
            (this.odEndpoint =
              'http://odata4.dev.cochlear.cloud/odata4/odata4.svc'),
            (this.secret = {
              od_env_username: 'dev_odata4_us',
              od_env_password: 'Odata4_0001'
            });
          this.cache = cache;
        }
        async init() { }
        isTestEnvironment() {
          return false;
        }
        isLocal() {
          return false;
        }
      })()
    );
    cache.get = getCachePartyId;
    orderHeadersStr =
      '[{"OrderLinesTotal":"45.46","Currency":"USD","Taxes":"4.54"}]';
    orderLinesStr =
      '[{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"}]';
  });
  afterEach(() => {
    sinon.restore();
  });

  it('CASE: getOrderHeaders returns 200 status code', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');
    const event = {
      queryStringParameters: {
        search: 'FlowStatusCode,OrderType,BillToPartyName'
      },
      requestContext
    };
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrdersList() { return JSON.parse(orderHeadersStr) }
      })()
    );

    const result = await getOrderHeaders(event);

    expect(result.statusCode).to.equal(200);
  });

  it('CASE: getOrderHeaders returns body containing orderHeaders string', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrdersList() { return JSON.parse(orderHeadersStr) }
      })()
    );
    const event = {
      queryStringParameters: {
        search: 'FlowStatusCode,OrderType,BillToPartyName'
      },
      requestContext
    };
    const result = await getOrderHeaders(event);

    expect(result).with.property('body');
    expect(result.body).to.equal(
      '{"success":true,"data":{"orderHeaders":[{"OrderLinesTotal":"45.46","Currency":"USD","Taxes":"4.54"}]}}'
    );
  });
  it('CASE: getOrderHeaders when request context / partyId is empty returns 404', async () => {
    cache.get = getCachePartyIdEmpty;
    const event = {
      queryStringParameters: {
        search: 'FlowStatusCode,OrderType,BillToPartyName'
      },
      requestContext
    };
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrdersList() { return JSON.parse(orderHeadersStr) }
      })()
    );
    const result = await getOrderHeaders(event);

    expect(result).with.property('body');
    expect(result.statusCode).to.equal(404);
  });

  it('CASE: getOrderLines returns 200 status code', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrderDetails() { return JSON.parse(orderLinesStr) }
      })()
    );
    const event = {
      queryStringParameters: {
        search: 'OrderNumber,QuantityCancelled,ShipToPartyName',
      },
      requestContext,
      pathParameters: { orderId: 1111111 },
    };
    const result = await getOrderLines(event);
    expect(result.statusCode).to.equal(200);
  });

  it('CASE: getOrderLines returns 404 status code when empty list is returned', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrderDetails() { return [] }
      })()
    );
    const event = {
      queryStringParameters: {
        search: 'OrderNumber,QuantityCancelled,ShipToPartyName'
      },
      pathParameters: { orderId: 1111111 },
      requestContext
    };
    const result = await getOrderLines(event);
    expect(result.statusCode).to.equal(404);
  });

  it('CASE: getOrderLines returns body containing orderLines string', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');

    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrderDetails() { return JSON.parse(orderLinesStr) }
      })()
    );
    const event = {
      queryStringParameters: {
        search: 'OrderNumber,QuantityCancelled,ShipToPartyName'
      },
      pathParameters: { orderId: 1111111 },
      requestContext
    };
    const result = await getOrderLines(event);
    expect(result).with.property('body');
    expect(result.body).to.equal(
      '{"success":true,"data":{"0":{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},"1":{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},"2":{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"},"3":{"OrderNumber":"1511331","LineStatus":"Closed","UnitPrice":"30.00"}}}'
    );
  });

  it('CASE: getOrderLines when orderId is empty returns 404', async () => {
    sinon.stub(jwtHelpers, 'getPartyIdForCochlearId').returns('1111');
    sinon.stub(controllers, 'OrdersController').returns(
      new (class {
        constructor() { }
        async getOrderDetails() { return JSON.parse(orderLinesStr) }
      })()
    );
    const event = {
      queryStringParameters: {
        search: 'OrderNumber,QuantityCancelled,ShipToPartyName'
      },
      requestContext
    };
    const result = await getOrderLines(event);
    expect(result).with.property('body');
    expect(result.statusCode).to.equal(404);
  });
});
