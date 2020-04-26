export interface PagSeguroConfig {
  email: string;
  token: string;
  appId?: string;
  appKey?: string;
  env: 'sandbox' | 'production';
  log: string;
  debug?: boolean;
  notificationURL?: string;
  redirectURL?: string;
}
