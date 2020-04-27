import axios, {
  AxiosInstance,
  AxiosTransformer,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { validate, parse } from 'fast-xml-parser';
import getBaseUrl from './GetBaseUrl';
import formatCurrencyType from './FormatCurrencyType';
import jsonToXml from './JsonToXml';
import Log from './Log';
import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';

const transformRequest: AxiosTransformer = (data, headers) => {
  data = formatCurrencyType(data);
  if (headers) {
    const contentType: string = headers['Content-Type'];
    if (contentType && contentType.indexOf('application/xml') >= 0) {
      data = jsonToXml(data);
    }
  }
  return data;
};

const transformResponse: AxiosTransformer = data => {
  const statusCode = 200;
  const isError = statusCode > 200;

  if (validate(data) === true) {
    data = parse(data, { trimValues: true });
    if (isError) {
      data = data.errors.error;
    }
  } else if (isError && !Array.isArray(data)) {
    data = [
      {
        code: statusCode,
        message: data,
      },
    ];
  }

  if (isError) {
    Log.error(data);
  } else {
    Log.info(data);
  }
  return data;
};

export type RequestFunction = <T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => Promise<R>;

export default class Request {
  private static innerInstance: AxiosInstance;

  static get instance(): AxiosInstance {
    if (Request.innerInstance == null) {
      throw new TypeError('Axios not initialized!');
    }
    return Request.innerInstance;
  }

  static get post(): RequestFunction {
    return Request.instance.post;
  }

  static get get(): RequestFunction {
    return Request.instance.get;
  }

  static init(config: PagSeguroConfig): void {
    if (Request.innerInstance != null) {
      return;
    }

    Request.innerInstance = axios.create({
      baseURL: getBaseUrl(config.env),
      transformRequest,
      transformResponse,
    });
  }
}
