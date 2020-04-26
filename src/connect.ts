import xml2js from 'fast-xml-parser';
import { Logger } from 'winston';
import logger from './logger';
import { getBaseUrl, validateConnect } from './utils';
import validate from './helper/validate';
import resources from './resources';

export default (params: {
  debug: any;
  log: any;
  env: any;
  appId: any;
  appKey: any;
  notificationURL: any;
  redirectURL: any;
  email: any;
  token: any;
}) => {
  /**
   * Validate params
   */
  if (!validateConnect(params)) {
    throw new TypeError(
      'Erro ao conectar com pagseguro! Verifique as configurações: [LINK REPOSITÓRIO]'
    );
  }

  /**
   * Log
   */
  let log: Logger | null = null;
  if (params.debug) {
    log = logger(params.log, params.debug);
  }

  /**
   * Config
   */
  const config = {
    logger: log,
    env: params.env,
    appId: params.appId,
    appKey: params.appKey,
    notificationURL: params.notificationURL,
    redirectURL: params.redirectURL,
    qs: {
      email: params.email,
      token: params.token,
    },
    base: {
      base: getBaseUrl(params.env, 'base'),
      static: getBaseUrl(params.env, 'static'),
      webservice: getBaseUrl(params.env, 'webservice'),
    },
    headers: {
      'Content-Type': 'application/xml',
      // Accept: "application/vnd.pagseguro.com.br.v3+xml"
    },
    transform: (
      body: string | any,
      response: { statusCode: number; statusMessage: any }
    ) => {
      const status = response.statusCode <= 200 ? 'success' : 'error';

      if (xml2js.validate(body) === true) {
        let content = xml2js.parse(body, { trimValues: true });

        if (response.statusCode <= 200) {
          if (log) {
            log.info({
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
              status,
              content,
            });
          }
        } else {
          content = content.errors.error;
          if (log) {
            log.error({
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

      if (log) {
        log.error({
          ...error,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
        });
      }

      return error;
    },
    jsonToXml: (json: any, options = { format: true }) => {
      const parser = new xml2js.j2xParser(options);
      return parser.parse(json);
    },
    xmlToJson: (xml: string, options = { trimValues: true }) => {
      return xml2js.parse(xml, options);
    },
  };

  /**
   * Resources
   */
  const rs: any = {};
  const resourcesAny = resources as any;
  Object.keys(resourcesAny).forEach(i => {
    rs[i] = { ...resourcesAny[i] };
    Object.keys(rs[i]).forEach(r => {
      if (validate.isFunction(rs[i][r])) {
        rs[i][r] = rs[i][r].bind(null, config);
      }
    });
  });

  return rs;
};
