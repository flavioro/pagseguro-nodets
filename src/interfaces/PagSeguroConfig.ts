import { PagSeguroEnv } from './PagSeguroTypes';

export interface PagSeguroConfig {
  email: string;
  token: string;
  appId?: string;
  appKey?: string;
  env: PagSeguroEnv;
  log: string;
  debug?: boolean;
  notificationURL?: string;
  redirectURL?: string;
}
