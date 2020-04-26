import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../../interfaces/PagSeguroClientOptions';

interface CancelarTransacaoRequest {
  transactionCode: string;
}

interface CancelarTransacaoResponse extends Response {
  result: string;
}

export default class CancelarTransacaoService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async transaction({
    transactionCode,
  }: CancelarTransacaoRequest): Promise<CancelarTransacaoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
          transactionCode,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v2/transactions/cancels/`,
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
