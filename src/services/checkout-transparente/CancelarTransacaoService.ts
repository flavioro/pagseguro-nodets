import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';

interface CancelarTransacaoRequest {
  transactionCode: string;
}

interface CancelarTransacaoResponse extends Response {
  result: string;
}

export default class CancelarTransacaoService extends BaseService {
  async transaction({
    transactionCode,
  }: CancelarTransacaoRequest): Promise<CancelarTransacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
          transactionCode,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v2/transactions/cancels/`,
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
