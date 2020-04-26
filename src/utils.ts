import config from './config';
import validate from './helper/validate';

export const getBaseUrl = (env = 'sandbox', path = 'base'): string =>
  (config as any)[path][env];

export const validateConnect = (params: {
  debug?: any;
  log?: any;
  env?: any;
  appId?: any;
  appKey?: any;
  notificationURL?: any;
  redirectURL?: any;
  email?: any;
  token?: any;
}): boolean => {
  if (!validate.isObject(params)) {
    return false;
  }

  const REQUIRED_PARAMS = ['email', 'token', 'env', 'log'];
  const keys = Object.keys(params);

  for (const i in REQUIRED_PARAMS) {
    if (keys.indexOf(REQUIRED_PARAMS[i]) === -1) {
      return false;
    }
  }

  return true;
};
