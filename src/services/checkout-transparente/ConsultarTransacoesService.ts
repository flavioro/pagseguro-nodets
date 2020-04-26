import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../../interfaces/PagSeguroRequestOptions';

interface ConsultarTransacoesRequest {
  reference: string;
  initialDate: Date;
  finalDate: Date;
  page: number;
  maxPageResults: number;
}

interface ConsultarTransacoesResponse extends Response {
  transactionSearchResult: {
    date: Date;
    currentPage: number;
    resultsInThisPage: number;
    totalPages: number;
    transactions: {
      transaction: {
        date: Date;
        lastEventDate: Date;
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
        feeAmount: number;
        netAmount: number;
        extraAmount: number;
      };
    }[];
  };
}

export default class ConsultarTransacoesService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get({
    reference,
    initialDate,
    finalDate,
    page,
    maxPageResults,
  }: ConsultarTransacoesRequest): Promise<ConsultarTransacoesResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
          reference,
          initialDate,
          finalDate,
          page,
          maxPageResults,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v3/transactions`,
        method: 'GET',
      });

      return {
        ...response,
        transactionSearchResult: response.content.transactionSearchResult,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
