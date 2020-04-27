import axios, {
  AxiosInstance,
  AxiosTransformer,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { validate, parse } from 'fast-xml-parser';
import getBaseUrl from './GetBaseUrl';
import formatCurrencyType from './FormatCurrencyType';
import jsonToXml from './JsonToXml';
import Log from './Log';
import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';

/* eslint-disable @typescript-eslint/no-explicit-any */

const transformRequest: AxiosTransformer = (data, headers) => {
  if (!data) {
    return data;
  }
  data = formatCurrencyType(data);
  if (headers) {
    const contentType: string = headers['Content-Type'];
    if (contentType && contentType.indexOf('application/xml') >= 0) {
      data = jsonToXml(data);
    }
  }
  return data;
};

const transformResponse = (response: AxiosResponse): any => {
  const { status } = response;
  let { data } = response;
  let xml = null;

  if (!data) {
    return data;
  }

  const isError = status > 200;
  const isXml = validate(data) === true;

  if (isXml) {
    xml = data;
    data = parse(data, { trimValues: true });
    if (isError) {
      data = data.errors.error;
    }
  } else if (isError) {
    if (!Array.isArray(data)) {
      data = [
        {
          code: status,
          message: data,
        },
      ];
    }
  }

  const logObject = {
    ...response,
    xml,
  };
  if (isError) {
    Log.error(logObject);
  } else {
    Log.info(logObject);
  }
  return data;
};

export type RequestFunction = <T>(
  url: string,
  config?: AxiosRequestConfig
) => Promise<AxiosResponse<T>>;

export type RequestFunctionBody = <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
) => Promise<AxiosResponse<T>>;

export default class Request {
  private static innerInstance: Request;

  static get instance(): Request {
    if (Request.innerInstance == null) {
      throw new TypeError('Axios not initialized!');
    }
    return Request.innerInstance;
  }

  static init(config: PagSeguroConfig): void {
    if (Request.innerInstance != null) {
      return;
    }

    Request.innerInstance = new Request(config);
  }

  private readonly axiosInstance: AxiosInstance;
  private constructor(config: PagSeguroConfig) {
    this.axiosInstance = axios.create({
      baseURL: getBaseUrl(config.env),
      transformRequest,
    });
  }

  post: RequestFunctionBody = <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.handleMethod<T>('post', url, data, config);
  };

  get: RequestFunction = <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return this.handleMethod<T>('get', url, null, config);
  };

  private handleMethod<T>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axiosInstance.request<T>({
          url,
          data,
          method,
          ...config,
        });
        response.data = transformResponse(response);
        resolve(response);
      } catch (e) {
        e.response = e.response || {};
        e.response.data = transformResponse(e.response);
        reject(e);
      }
    });
  }
}
/* eslint-enable */
