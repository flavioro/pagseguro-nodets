import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../../interfaces/PagSeguroRequestOptions';
import { PagSeguroItem } from '../../interfaces/PagSeguroItem';
import { PagSeguroSender } from '../../interfaces/PagSeguroSender';

interface ConsultarTransacaoRequest {
  transactionCode: string;
}

interface ConsultarTransacaoResponse extends Response {
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
    creditorFees: {
      operationalFeeAmount: number;
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
    primaryReceiver: {
      publicKey: string;
    };
  };
}

export default class ConsultarTransacaoService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get({
    transactionCode,
  }: ConsultarTransacaoRequest): Promise<ConsultarTransacaoResponse> {
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
        url: `${this.opts.api.webservice}/v3/transactions/${transactionCode}`,
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
