import request from 'request-promise';
import { PagSeguroResponse } from '../interfaces/PagSeguroResponse';
import PagSeguroError from '../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../interfaces/PagSeguroRequestOptions';

interface InstallmentRequest {
  amount: number | string;
  cardBrand: string;
  maxInstallmentNoInterest: number;
}

export default class InstallmentService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get(params: InstallmentRequest): Promise<PagSeguroResponse> {
    if (
      params.amount &&
      typeof params.amount !== 'string' &&
      params.amount.toFixed
    ) {
      params.amount = params.amount.toFixed(2);
    }

    this.opts.qs = {
      ...this.opts.qs,
      ...params,
    };

    try {
      const response = await request({
        ...this.opts,
        url: `${this.opts.base.webservice}/${this.opts.wsConfig.installment}`,
        method: 'GET',
      });

      return {
        ...response,
        content: response.content
          ? response.content.installments.installment
          : [],
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
