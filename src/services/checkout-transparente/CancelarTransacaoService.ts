import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../../interfaces/PagSeguroRequestOptions';

interface CancelarTransacaoRequest {
  transactionCode: string;
}

interface CancelarTransacaoResponse extends Response {
  result: string;
}

export default class CancelarTransacaoService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
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
        url: `${this.opts.api.webservice}/v2/transactions/cancels/`,
        method: 'POST',
      });

      return {
        ...response,
        result: response.content.result,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
