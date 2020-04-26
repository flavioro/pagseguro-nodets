import { Logger } from 'winston';
import { Response } from 'request';
import xml2js from 'fast-xml-parser';
import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';
import getBaseUrl from '../helper/GetBaseUrl';

export default abstract class BaseService {
  protected readonly config: PagSeguroConfig;
  protected readonly api: string;
  protected readonly logResponses: boolean;
  protected readonly logger: Logger;
  protected readonly transformResponseXmlToJson: (
    body: any,
    response: Response
  ) => any;

  constructor(config: PagSeguroConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.logResponses = !!config.logResponses;
    this.api = getBaseUrl(config.env);

    this.transformResponseXmlToJson = (body, response): any => {
      const status = response.statusCode <= 200 ? 'success' : 'error';

      if (xml2js.validate(body) === true) {
        let content = xml2js.parse(body, { trimValues: true });

        if (response.statusCode <= 200) {
          if (this.logResponses) {
            this.logger.info({
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
              status,
              content,
            });
          }
        } else {
          content = content.errors.error;
          if (this.logResponses) {
            this.logger.error({
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
              status,
              content,
            });
          }
        }

        return {
          statusCode: response.statusCode,
          status,
          content,
        };
      }

      const error = {
        statusCode: response.statusCode,
        status,
        content: body,
      };

      if (!Array.isArray(error.content)) {
        error.content = [
          {
            code: error.statusCode,
            message: error.content,
          },
        ];
      }

      if (this.logResponses) {
        this.logger.error({
          ...error,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
        });
      }

      return error;
    };
  }
}
