import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';

interface CancelarTransacaoRequest {
  transactionCode: string;
}

interface CancelarTransacaoResponse {
  result: string;
}

export default class CancelarTransacaoService extends BaseService {
  async transaction({
    transactionCode,
  }: CancelarTransacaoRequest): Promise<CancelarTransacaoResponse> {
    try {
      const response = await this.post<CancelarTransacaoResponse>(
        '/v2/transactions/cancels/',
        null,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            email: this.config.email,
            token: this.config.token,
            transactionCode,
          },
        }
      );
      return response.data;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
