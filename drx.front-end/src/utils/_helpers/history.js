import { createBrowserHistory } from 'history';

export const history =
  typeof document !== 'undefined' ? createBrowserHistory() : null;
