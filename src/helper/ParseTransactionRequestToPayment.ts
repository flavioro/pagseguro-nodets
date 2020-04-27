import { PagSeguroPayment } from '../interfaces/PagSeguroPayment';
import { PagSeguroBoletoRequest } from '../interfaces/PagSeguroBoletoRequest';
import { PagSeguroDebitoOnlineRequest } from '../interfaces/PagSeguroDebitoOnlineRequest';
import { PagSeguroCartaoCreditoRequest } from '../interfaces/PagSeguroCartaoCreditoRequest';

const parseTransactionRequestToPayment = (
  request:
    | PagSeguroBoletoRequest
    | PagSeguroDebitoOnlineRequest
    | PagSeguroCartaoCreditoRequest,
  method: 'boleto' | 'creditCard' | 'eft'
): PagSeguroPayment => {
  return {
    ...request,
    mode: 'default',
    method,
    currency: 'BRL',
    shipping: {
      addressRequired: request.shipping.address != null,
      ...request.shipping,
    },
  };
};

export default parseTransactionRequestToPayment;
