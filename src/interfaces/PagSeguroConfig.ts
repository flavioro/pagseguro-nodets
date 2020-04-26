export interface PagSeguroConfig {
  email: string;
  token: string;
  appId?: string;
  appKey?: string;
  env: 'sandbox' | 'production';
  logDir: string;
  debug?: boolean;
  logResponses?: boolean;
  notificationURL?: string;
  redirectURL?: string;
}
