import { PagSeguroTransactionRequest } from '../interfaces/PagSeguroTransactionRequest';
import { PagSeguroPayment } from '../interfaces/PagSeguroPayment';
import formatCurrencyType from './FormatCurrencyType';

const pagSeguroTransactionRequestToPayment = (
  request: PagSeguroTransactionRequest,
  method: 'boleto' | 'creditCard' | 'eft'
): PagSeguroPayment => {
  const parsedRequest = formatCurrencyType(request);
  return {
    ...parsedRequest,
    mode: 'default',
    method,
    currency: 'BRL',
    shipping: {
      addressRequired: true,
      ...parsedRequest.shipping,
    },
  };
};

export default pagSeguroTransactionRequestToPayment;
