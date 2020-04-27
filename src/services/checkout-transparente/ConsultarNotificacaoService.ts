import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransaction } from '../../interfaces/PagSeguroTransaction';

interface ConsultarNotificacaoRequest {
  notificationCode: string;
}

interface ConsultarNotificacaoResponse {
  transaction: PagSeguroTransaction;
}

export default class ConsultarNotificacaoService extends BaseService {
  async find({
    notificationCode,
  }: ConsultarNotificacaoRequest): Promise<ConsultarNotificacaoResponse> {
    try {
      const response = await this.get<ConsultarNotificacaoResponse>(
        `/v3/transactions/notifications/${notificationCode}`,
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
