import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../../interfaces/PagSeguroClientOptions';
import { PagSeguroItem } from '../../interfaces/PagSeguroItem';
import { PagSeguroSender } from '../../interfaces/PagSeguroSender';
import { PagSeguroShipping } from '../../interfaces/PagSeguroShipping';

interface ConsultarNotificacaoRequest {
  notificationCode: string;
}

interface ConsultarNotificacaoResponse extends Response {
  transaction: {
    date: Date;
    code: string;
    reference: string;
    type: number;
    status: number;
    paymentMethod: {
      type: number;
      code: number;
    };
    grossAmount: number;
    discontAmount: number;
    credutirFees: {
      intermediationRateAmount: number;
      intermediationFeeAmount: number;
    };
    feeAmount: number;
    netAmount: number;
    extraAmount: number;
    installmentCount: number;
    itemCount: number;
    items: {
      item: PagSeguroItem;
    }[];
    sender: PagSeguroSender;
    shipping: PagSeguroShipping;
  };
}

export default class ConsultarNotificacaoService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async get({
    notificationCode,
  }: ConsultarNotificacaoRequest): Promise<ConsultarNotificacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v3/transactions/notifications/${notificationCode}`,
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
