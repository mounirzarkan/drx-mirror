import config from '../../config';

// switch authentication endpoints for local development
// to get callback urls from lambda service (instead of salesforce) set process environement to LOCAL at runtime
// $ REACT_APP_TEST_VAR=LOCAL jss start
// if REACT_APP_TEST_VAR=LOCAL is true, config.endpoints calls different endpoint for local development
const isLocal = process.env.REACT_APP_TEST_VAR === 'LOCAL';
export const environment = isLocal ? 'LOCAL' : config.env || 'SIT';
