import { Router } from 'express';
import { PagSeguroRouteHandlers } from '../interfaces/PagSeguroRouteHandlers';
import { PagSeguroClient } from '../interfaces/PagSeguroClient';
import handleFunction from '../helper/HandleFunction';
import PagSeguroError from '../errors/PagSeguroError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateBody = (object: any, ...params: string[]): void => {
  if (object && params) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of params) {
      const val = object[key];
      if (!val) {
        throw new PagSeguroError({
          statusText: `Invalid parameters, field ${key} is required`,
          status: 405,
          data: [],
        });
      }
    }
  } else {
    throw new PagSeguroError({
      statusText: `Invalid parameters, body is required`,
      status: 405,
      data: [],
    });
  }
};

const getCheckoutTransparenteRoute = (
  client: PagSeguroClient,
  handlers?: PagSeguroRouteHandlers
): Router => {
  const router = Router();

  /**
   * Rota geracao de transacao -> boleto
   */
  router.post('/boleto', async (request, response) => {
    const config = handlers?.checkoutTransparente?.boleto;
    const service = client.checkoutTransparente.boletoService;

    try {
      handleFunction(config?.onInit, request, response);
      const { body } = request;
      validateBody(body, 'sender', 'items', 'shipping');
      const boleto = await service.transaction(body);
      handleFunction(config?.onLoad, boleto, request, response);
      response.json(boleto);
    } catch (e) {
      handleFunction(config?.onError, e, request, response);
      throw e;
    }
  });

  /**
   * Rota geracao de transacao -> cartao de credito
   */
  router.post('/cartao-credito', async (request, response) => {
    const config = handlers?.checkoutTransparente?.cartaoCredito;
    const service = client.checkoutTransparente.cartaoCreditoService;

    try {
      handleFunction(config?.onInit, request, response);
      const { body } = request;
      validateBody(body, 'sender', 'items', 'shipping', 'creditCard');
      const boleto = await service.transaction(body);
      handleFunction(config?.onLoad, boleto, request, response);
      response.json(boleto);
    } catch (e) {
      handleFunction(config?.onError, e, request, response);
      throw e;
    }
  });

  /**
   * Rota geracao de transacao -> debito online
   */
  router.post('/debito-online', async (request, response) => {
    const config = handlers?.checkoutTransparente?.debitoOnline;
    const service = client.checkoutTransparente.debitoOnlineService;

    try {
      handleFunction(config?.onInit, request, response);
      const { body } = request;
      validateBody(body, 'sender', 'items', 'shipping', 'bank');
      const boleto = await service.transaction(body);
      handleFunction(config?.onLoad, boleto, request, response);
      response.json(boleto);
    } catch (e) {
      handleFunction(config?.onError, e, request, response);
      throw e;
    }
  });

  return router;
};

export default getCheckoutTransparenteRoute;
