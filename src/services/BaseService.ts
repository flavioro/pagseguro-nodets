import { Response } from 'request';
import xml2js from 'fast-xml-parser';
import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';
import getBaseUrl from '../helper/GetBaseUrl';
import Log from '../helper/Log';
import Request, { RequestFunction } from '../helper/Request';

export default abstract class BaseService {
  protected readonly config: PagSeguroConfig;
  protected readonly api: string;
  protected readonly transformResponseXmlToJson: (
    body: any,
    response: Response
  ) => Response;

  protected get post(): RequestFunction {
    return Request.post;
  }

  protected get get(): RequestFunction {
    return Request.get;
  }

  constructor(config: PagSeguroConfig) {
    Log.init(config.logDir, config.logConsole);
    Request.init(config);

    this.config = config;
    this.api = getBaseUrl(config.env);

    this.transformResponseXmlToJson = (body, response): Response => {
      const isError = response.statusCode > 200;

      if (xml2js.validate(body) === true) {
        body = xml2js.parse(body, { trimValues: true });
        if (isError) {
          body = body.errors.error;
        }
      } else if (isError && !Array.isArray(body)) {
        body = [
          {
            code: response.statusCode,
            message: body,
          },
        ];
      }

      response.body = body;

      if (isError) {
        Log.error(response);
      } else {
        Log.info(response);
      }
      return response;
    };
  }
}
