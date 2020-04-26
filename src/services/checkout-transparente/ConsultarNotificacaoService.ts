import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../../interfaces/PagSeguroRequestOptions';
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
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
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
        url: `${this.opts.api.webservice}/v3/transactions/notifications/${notificationCode}`,
        method: 'GET',
      });

      return {
        ...response,
        transaction: response.content.transaction,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
