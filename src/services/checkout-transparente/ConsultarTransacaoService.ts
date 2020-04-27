import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransaction } from '../../interfaces/PagSeguroTransaction';

interface ConsultarTransacaoRequest {
  transactionCode: string;
}

interface ConsultarTransacaoResponse {
  transaction: PagSeguroTransaction;
}

export default class ConsultarTransacaoService extends BaseService {
  async find({
    transactionCode,
  }: ConsultarTransacaoRequest): Promise<ConsultarTransacaoResponse> {
    try {
      const response = await this.get<ConsultarTransacaoResponse>(
        `/v3/transactions/${transactionCode}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
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
