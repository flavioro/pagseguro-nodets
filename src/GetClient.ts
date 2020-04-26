import xml2js from 'fast-xml-parser';
import { Logger } from 'winston';
import logger from './logger';
import { getBaseUrl, validateConfig } from './helper/utils';
import wsConfig from './config/api';
import { PagSeguroConfig } from './interfaces/PagSeguroConfig';
import { PagSeguroRequestOptions } from './interfaces/PagSeguroRequestOptions';
import { PagSeguroClient } from './interfaces/PagSeguroClient';
import SessionService from './services/SessionService';
import InstallmentService from './services/InstallmentService';
import BoletoService from './services/checkout-transparente/BoletoService';
import AuthorizationService from './services/AuthorizationService';

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
    config: params,
    api: {
      base: getBaseUrl('base', params.env),
      static: getBaseUrl('static', params.env),
      webservice: getBaseUrl('webservice', params.env),
      config: wsConfig,
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

  return {
    sessionService: new SessionService(config),
    installmentService: new InstallmentService(config),
    authorizationService: new AuthorizationService(config),
    checkoutTransparente: {
      boletoService: new BoletoService(config),
    },
  };
};

export default getClient;
