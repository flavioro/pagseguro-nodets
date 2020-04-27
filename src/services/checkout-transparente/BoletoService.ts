import PagSeguroError from '../../errors/PagSeguroError';
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

      const response = await this.post<PagSeguroTransactionResponse>(
        '/v2/transactions',
        { payment },
        {
          headers: {
            'Content-Type': 'application/xml',
          },
          params: {
            email: this.config.email,
            token: this.config.token,
          },
        }
      );
      return response.data;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
