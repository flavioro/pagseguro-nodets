import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../interfaces/PagSeguroRequestOptions';

interface SessionResponse extends Response {
  session: {
    id: string;
  };
}

/**
 * Este serviço é utilizado em:
 * CHECKOUT TRANSPARENTE;
 * SPLIT DE PAGAMENTO;
 */
export default class SessionService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get(): Promise<SessionResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        headers: {
          Accept: 'application/vnd.pagseguro.com.br.v3+xml',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v2/sessions`,
        method: 'POST',
      });

      return {
        ...response,
        session: response.content.session,
      };
    } catch (e) {
      const error = { ...e.response };
      if (error.content && error.content === 'Unauthorized') {
        error.content = [
          {
            code: 401,
            message: 'Unauthorized',
          },
        ];
      }

      throw new PagSeguroError(error);
    }
  }
}
