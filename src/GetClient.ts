import xml2js from 'fast-xml-parser';
import { Logger } from 'winston';
import logger from './Logger';
import { PagSeguroConfig } from './interfaces/PagSeguroConfig';
import { PagSeguroClientOptions } from './interfaces/PagSeguroClientOptions';
import { PagSeguroClient } from './interfaces/PagSeguroClient';
import SessionService from './services/SessionService';
import BoletoService from './services/checkout-transparente/BoletoService';
import CancelarTransacaoService from './services/checkout-transparente/CancelarTransacaoService';
import CartaoCreditoService from './services/checkout-transparente/CartaoCreditoService';
import ConsultarNotificacaoService from './services/checkout-transparente/ConsultarNotificacaoService';
import ConsultarTransacaoService from './services/checkout-transparente/ConsultarTransacaoService';
import ConsultarTransacoesService from './services/checkout-transparente/ConsultarTransacoesService';
import DebitoOnlineService from './services/checkout-transparente/DebitoOnlineService';
import EstornarTransacaoService from './services/checkout-transparente/EstornarTransacaoService';
import validateConfig from './helper/ValidateConfig';
import getBaseUrl from './helper/GetBaseUrl';

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

  const config: PagSeguroClientOptions = {
    logger: log,
    config: params,
    api: getBaseUrl(params.env),
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
    checkoutTransparente: {
      boletoService: new BoletoService(config),
      cancelarTransacaoService: new CancelarTransacaoService(config),
      cartaoCreditoService: new CartaoCreditoService(config),
      consultarNotificaoService: new ConsultarNotificacaoService(config),
      consultarTransacaoService: new ConsultarTransacaoService(config),
      consultarTransacoesService: new ConsultarTransacoesService(config),
      debitoOnlineService: new DebitoOnlineService(config),
      estornarTransacaoService: new EstornarTransacaoService(config),
    },
  };
};

export default getClient;
