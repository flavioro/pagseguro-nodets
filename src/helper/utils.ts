import xml2js, { j2xParser } from 'fast-xml-parser';
import api from '../config/api';
import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';
import { PagSeguroEnv, PagSeguroType } from '../interfaces/PagSeguroTypes';

export const getBaseUrl = (
  env: PagSeguroType = 'base',
  path: PagSeguroEnv = 'sandbox'
): string => api[env][path];

export const validateConfig = (params: PagSeguroConfig): boolean => {
  const { email, token, env, log } = params;
  return !!(email && token && env && log);
};

export const jsonToXml = (json: object): object => {
  // eslint-disable-next-line new-cap
  return new j2xParser({ format: true }).parse(json);
};

export const xmlToJson = (xml: string): string => {
  return xml2js.parse(xml, { trimValues: true });
};
