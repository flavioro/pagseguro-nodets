import {Logger} from 'winston';
import {RequestPromiseOptions} from 'request-promise';
import {PagSeguroEnv} from './PagSeguroTypes';
import {PagSeguroWsConfig} from './PagSeguroWsConfig';

export interface PagSeguroRequestOptions extends RequestPromiseOptions {
  logger?: Logger;
  env?: PagSeguroEnv;
  appId?: string;
  appKey?: string;
  notificationURL?: string;
  redirectURL?: string;
  base: {
    base: string;
    static: string;
    webservice: string;
  };
  jsonToXml: (object: object) => string;
  xmlToJson: (xml: string) => object;
  wsConfig: PagSeguroWsConfig;
}
