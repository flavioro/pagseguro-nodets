import requestPromise from 'request-promise';
import PagSeguroError from '../../errors/PagSeguroError';
import jsonToXml from '../../helper/JsonToXml';
import BaseService from '../BaseService';
import { PagSeguroTransactionResponse } from '../../interfaces/PagSeguroTransactionResponse';
import { PagSeguroTransactionRequest } from '../../interfaces/PagSeguroTransactionRequest';
import pagSeguroTransactionRequestToPayment from '../../helper/PagSeguroTransactionRequestToPayment';

export default class DebitoOnlineService extends BaseService {
  async transaction(
    request: PagSeguroTransactionRequest
  ): Promise<PagSeguroTransactionResponse> {
    try {
      const payment = pagSeguroTransactionRequestToPayment(request, 'eft');
      delete payment.creditCard;

      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
        },
        headers: {
          'Content-Type': 'application/xml',
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v2/transactions`,
        method: 'POST',
        body: jsonToXml({
          payment,
        }),
      });

      return response.body.transaction;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
