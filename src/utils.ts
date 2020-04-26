import config from './config';
import {PagSeguroConfig} from './interfaces/PagSeguroConfig';
import {PagSeguroEnv, PagSeguroType} from './interfaces/PagSeguroTypes';

export const getBaseUrl = (
  env: PagSeguroType = 'base',
  path: PagSeguroEnv = 'sandbox'
): string => config[env][path];

export const validateConfig = (params: PagSeguroConfig): boolean => {
  const {email, token, env, log} = params;
  return !!(email && token && env && log);
};
