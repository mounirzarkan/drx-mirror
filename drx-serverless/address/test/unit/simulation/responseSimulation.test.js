'use strict';

const {expect} = require('chai');
const {ResponseSimulation} = require('../../../src/simulation/index.js');

describe('SUITE: ResponseSimulation', () => {
  const env = {
    errorUsers: {
      address: {
        getAddress: [
          {cid: '153419478037266', email: 'getAddress'},
          {cid: '173623417645470', email: 'getAddress'},
          {cid: '180366660111140', email: 'getAddress'}
        ],
        postAddress: [
          {cid: '174754785448474', email: 'postAddress'},
          {cid: '237329836590737', email: 'postAddress'},
          {cid: '275828987054544', email: 'postAddress'}
        ]
      }
    }
  };

  it('CASE: simulate with a matching id and apiName expects to throw an error', () => {
    const responseSimulation = new ResponseSimulation(env);
    expect(
      responseSimulation.simulate.bind(
        responseSimulation,
        '174754785448474',
        'postAddress'
      )
    )
      .to.throw()
      .with.property('message')
      .to.equal('Simulated Error');
  });

  it('CASE: simulate with a NON-matching id and matching apiName expects to NOT throw an error', () => {
    const responseSimulation = new ResponseSimulation(env);
    expect(
      responseSimulation.simulate.bind(
        responseSimulation,
        '2222222',
        'getAddress'
      )
    ).to.not.throw();
  });

  it('CASE: simulate with a matching id and NON-matching apiName expects to NOT throw an error', () => {
    const responseSimulation = new ResponseSimulation(env);
    expect(
      responseSimulation.simulate.bind(
        responseSimulation,
        '1111111',
        'postAddress'
      )
    ).to.not.throw();
  });
});
