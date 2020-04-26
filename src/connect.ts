import xml2js, { j2xParser } from 'fast-xml-parser';
import { Logger } from 'winston';
import logger from './logger';
import { getBaseUrl, validateConfig } from './utils';
import validate from './helper/validate';
import resources from './resources';
import wsConfig from './config';
import { PagSeguroConfig } from './interfaces/PagSeguroConfig';
import { PagSeguroRequestOptions } from './interfaces/PagSeguroRequestOptions';
import { PagSeguroClient } from './interfaces/PagSeguroClient';
import SessionService from './services/SessionService';
import InstallmentService from './services/InstallmentService';

const getClient = (params?: PagSeguroConfig): PagSeguroClient => {
  if (!params || !validateConfig(params)) {
    throw new TypeError(
      'Erro ao conectar com pagseguro! Verifique as configurações: [LINK REPOSITÓRIO]'
    );
  }

  let log: Logger | undefined;
  if (params.debug) {
    log = logger(params.log, params.debug);
  }

  const config: PagSeguroRequestOptions = {
    logger: log,
    env: params.env,
    appId: params.appId,
    appKey: params.appKey,
    notificationURL: params.notificationURL,
    redirectURL: params.redirectURL,
    base: {
      base: getBaseUrl('base', params.env),
      static: getBaseUrl('static', params.env),
      webservice: getBaseUrl('webservice', params.env),
    },
    wsConfig,
    jsonToXml: object => {
      // eslint-disable-next-line new-cap
      return new j2xParser({ format: true }).parse(object);
    },
    xmlToJson: xml => {
      return xml2js.parse(xml, { trimValues: true });
    },
    qs: {
      email: params.email,
      token: params.token,
    },
    headers: {
      'Content-Type': 'application/xml',
      // Accept: "application/vnd.pagseguro.com.br.v3+xml"
    },
    transform: (body, response) => {
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

  return {
    sessionService: new SessionService(config),
    installmentService: new InstallmentService(config),
  };
};

export default getClient;
