import { Logger } from 'winston';
import { RequestPromiseOptions } from 'request-promise';
import { PagSeguroConfig } from './PagSeguroConfig';

export interface PagSeguroClientOptions extends RequestPromiseOptions {
  logger?: Logger;
  config: PagSeguroConfig;
  api: string;
}
