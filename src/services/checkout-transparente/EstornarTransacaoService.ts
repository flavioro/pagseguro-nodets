import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';

interface EstornarTransacaoRequest {
  transactionCode: string;
  refundValue?: number;
}

interface EstornarTransacaoResponse {
  result: string;
}

export default class EstornarTransacaoService extends BaseService {
  async transaction({
    transactionCode,
    refundValue,
  }: EstornarTransacaoRequest): Promise<EstornarTransacaoResponse> {
    try {
      const response = await this.post<EstornarTransacaoResponse>(
        `/v2/transactions/refunds`,
        null,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            email: this.config.email,
            token: this.config.token,
            transactionCode,
            refundValue,
          },
        }
      );
      return response.data;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
