export interface PagSeguroConfig {
  email: string;
  token: string;
  appId?: string;
  appKey?: string;
  env: 'sandbox' | 'production';
  logDir: string;
  logConsole?: boolean;
  notificationURL?: string;
  redirectURL?: string;
}
