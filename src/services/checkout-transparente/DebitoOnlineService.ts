import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../../interfaces/PagSeguroClientOptions';
import { PagSeguroSender } from '../../interfaces/PagSeguroSender';
import { PagSeguroItem } from '../../interfaces/PagSeguroItem';
import { PagSeguroShipping } from '../../interfaces/PagSeguroShipping';
import jsonToXml from '../../helper/JsonToXml';

interface DebitoOnlineRequest {
  sender: PagSeguroSender;
  items: {
    item: PagSeguroItem;
  }[];
  extraAmount?: number;
  reference?: string;
  notificationURL?: string;
  shipping: PagSeguroShipping;
}

interface DebitoOnlineResponse extends Response {
  transaction: {
    date: Date;
    code: string;
    reference: string;
    type: number;
    status: number;
    lastEventDate: Date;
    paymentMethod: {
      type: number;
      code: number;
    };
    paymentLink: string;
    grossAmount: number;
    discontAmount: number;
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

export default class DebitoOnlineService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async transaction(
    request: DebitoOnlineRequest
  ): Promise<DebitoOnlineResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        headers: {
          'Content-Type': 'application/xml',
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v2/transactions`,
        method: 'POST',
        body: jsonToXml({
          payment: {
            ...request,
            mode: 'default',
            method: 'eft',
            currency: 'BRL',
          },
        }),
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
