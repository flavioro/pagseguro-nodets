import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransactionResponse } from '../../interfaces/PagSeguroTransactionResponse';

interface ConsultarTransacaoRequest {
  transactionCode: string;
}

interface ConsultarTransacaoResponse extends Response {
  transaction: PagSeguroTransactionResponse;
}

export default class ConsultarTransacaoService extends BaseService {
  async get({
    transactionCode,
  }: ConsultarTransacaoRequest): Promise<ConsultarTransacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v3/transactions/${transactionCode}`,
        method: 'GET',
      });

      return {
        ...response,
        transaction: response.content.transaction,
      };
    } catch ({ response }) {
      const { status, statusText, content } = response;
      throw new PagSeguroError(status, statusText, content);
    }
  }
}
