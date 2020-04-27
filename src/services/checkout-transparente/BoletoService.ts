import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransaction } from '../../interfaces/PagSeguroTransaction';
import parseTransactionRequestToPayment from '../../helper/ParseTransactionRequestToPayment';
import { PagSeguroBoletoRequest } from '../../interfaces/PagSeguroBoletoRequest';

export default class BoletoService extends BaseService {
  async transaction(
    request: PagSeguroBoletoRequest
  ): Promise<PagSeguroTransaction> {
    try {
      const payment = parseTransactionRequestToPayment(request, 'boleto');

      const response = await this.post<PagSeguroTransaction>(
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
