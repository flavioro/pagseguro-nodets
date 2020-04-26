import { Logger } from 'winston';
import { RequestPromiseOptions } from 'request-promise';
import { PagSeguroWsConfig } from './PagSeguroWsConfig';
import { PagSeguroConfig } from './PagSeguroConfig';

export interface PagSeguroRequestOptions extends RequestPromiseOptions {
  logger?: Logger;
  config: PagSeguroConfig;
  api: {
    base: string;
    static: string;
    webservice: string;
    config: PagSeguroWsConfig;
  };
}
