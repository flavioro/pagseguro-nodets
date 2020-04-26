import requestPromise from 'request-promise';
import PagSeguroError from '../../errors/PagSeguroError';
import jsonToXml from '../../helper/JsonToXml';
import BaseService from '../BaseService';
import { PagSeguroTransactionResponse } from '../../interfaces/PagSeguroTransactionResponse';
import { PagSeguroTransactionRequest } from '../../interfaces/PagSeguroTransactionRequest';
import pagSeguroTransactionRequestToPayment from '../../helper/PagSeguroTransactionRequestToPayment';

export default class BoletoService extends BaseService {
  async transaction(
    request: PagSeguroTransactionRequest
  ): Promise<PagSeguroTransactionResponse> {
    try {
      const payment = pagSeguroTransactionRequestToPayment(request, 'boleto');
      delete payment.creditCard;

      const response = await requestPromise({
        headers: {
          'Content-Type': 'application/xml',
        },
        qs: {
          email: this.config.email,
          token: this.config.token,
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v2/transactions`,
        method: 'POST',
        body: jsonToXml({
          payment,
        }),
      });

      return response.content.transaction;
    } catch ({ response }) {
      const { status, statusText, content } = response;
      throw new PagSeguroError(status, statusText, content);
    }
  }
}
