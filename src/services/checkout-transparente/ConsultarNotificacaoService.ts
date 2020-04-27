import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransactionResponse } from '../../interfaces/PagSeguroTransactionResponse';

interface ConsultarNotificacaoRequest {
  notificationCode: string;
}

interface ConsultarNotificacaoResponse extends Response {
  transaction: PagSeguroTransactionResponse;
}

export default class ConsultarNotificacaoService extends BaseService {
  async get({
    notificationCode,
  }: ConsultarNotificacaoRequest): Promise<ConsultarNotificacaoResponse> {
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
        url: `${this.api}/v3/transactions/notifications/${notificationCode}`,
        method: 'GET',
      });

      return {
        ...response,
        transaction: response.body.transaction,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
