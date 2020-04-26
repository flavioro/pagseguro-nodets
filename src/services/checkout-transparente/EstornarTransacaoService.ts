import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../../interfaces/PagSeguroClientOptions';

interface EstornarTransacaoRequest {
  transactionCode: string;
  refundValue?: number;
}

interface EstornarTransacaoResponse extends Response {
  result: string;
}

export default class EstornarTransacaoService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async transaction({
    transactionCode,
    refundValue,
  }: EstornarTransacaoRequest): Promise<EstornarTransacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
          transactionCode,
          refundValue,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v2/transactions/refunds`,
        method: 'POST',
      });

      return {
        ...response,
        result: response.content.result,
      };
    } catch ({ response }) {
      const { status, statusText, content } = response;
      throw new PagSeguroError(status, statusText, content);
    }
  }
}
