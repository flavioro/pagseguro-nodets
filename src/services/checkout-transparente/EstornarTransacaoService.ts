import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';

interface EstornarTransacaoRequest {
  transactionCode: string;
  refundValue?: number;
}

interface EstornarTransacaoResponse extends Response {
  result: string;
}

export default class EstornarTransacaoService extends BaseService {
  async transaction({
    transactionCode,
    refundValue,
  }: EstornarTransacaoRequest): Promise<EstornarTransacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
          transactionCode,
          refundValue,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v2/transactions/refunds`,
        method: 'POST',
      });

      return {
        ...response,
        result: response.body.result,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
