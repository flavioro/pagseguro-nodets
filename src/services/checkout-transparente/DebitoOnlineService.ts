import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransaction } from '../../interfaces/PagSeguroTransaction';
import parseTransactionRequestToPayment from '../../helper/ParseTransactionRequestToPayment';
import { PagSeguroDebitoOnlineRequest } from '../../interfaces/PagSeguroDebitoOnlineRequest';

export default class DebitoOnlineService extends BaseService {
  async transaction(
    request: PagSeguroDebitoOnlineRequest
  ): Promise<PagSeguroTransaction> {
    try {
      const payment = parseTransactionRequestToPayment(request, 'eft');

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
