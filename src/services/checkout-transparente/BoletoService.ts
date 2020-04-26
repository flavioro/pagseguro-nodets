import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../../interfaces/PagSeguroClientOptions';
import { PagSeguroSender } from '../../interfaces/PagSeguroSender';
import { PagSeguroItem } from '../../interfaces/PagSeguroItem';
import { PagSeguroShipping } from '../../interfaces/PagSeguroShipping';
import jsonToXml from '../../helper/JsonToXml';
import { currency } from '../../interfaces/CurrencyType';
import formatCurrencyType from '../../helper/FormatCurrencyType';

interface BoletoRequest {
  sender: PagSeguroSender;
  items: {
    item: PagSeguroItem[];
  };
  extraAmount?: currency;
  reference?: string;
  notificationURL?: string;
  shipping: PagSeguroShipping;
}

interface BoletoResponse extends Response {
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
    grossAmount: currency;
    discontAmount: currency;
    feeAmount: currency;
    netAmount: currency;
    extraAmount: currency;
    installmentCount: number;
    itemCount: number;
    items: {
      item: PagSeguroItem;
    }[];
    sender: PagSeguroSender;
    shipping: PagSeguroShipping;
  };
}

export default class BoletoService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async transaction(request: BoletoRequest): Promise<BoletoResponse> {
    try {
      const parsedRequest = formatCurrencyType(request);
      const response = await requestPromise({
        headers: {
          'Content-Type': 'application/xml',
        },
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v2/transactions`,
        method: 'POST',
        body: jsonToXml({
          payment: {
            ...parsedRequest,
            mode: 'default',
            method: 'boleto',
            currency: 'BRL',
            shipping: {
              addressRequired: true,
              ...parsedRequest.shipping,
            },
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
