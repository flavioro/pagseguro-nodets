import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../errors/PagSeguroError';
import { PagSeguroClientOptions } from '../interfaces/PagSeguroClientOptions';

interface SessionResponse extends Response {
  session: {
    id: string;
  };
}

export default class SessionService {
  private readonly opts: PagSeguroClientOptions;

  constructor(opts: PagSeguroClientOptions) {
    this.opts = opts;
  }

  async get(): Promise<SessionResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        transform: this.opts.transform,
        url: `${this.opts.api}/v2/sessions`,
        method: 'POST',
      });

      return {
        ...response,
        session: response.content.session,
      };
    } catch ({ response }) {
      if (response.content && response.content === 'Unauthorized') {
        response.content = [
          {
            code: 401,
            message: 'Unauthorized',
          },
        ];
      }

      const { status, statusText, content } = response;
      throw new PagSeguroError(status, statusText, content);
    }
  }
}
