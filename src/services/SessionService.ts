import request from 'request-promise';
import {PagSeguroResponse} from '../interfaces/PagSeguroResponse';
import PagSeguroError from '../errors/PagSeguroError';
import {PagSeguroRequestOptions} from '../interfaces/PagSeguroRequestOptions';

export default class SessionService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get(): Promise<PagSeguroResponse> {
    try {
      const response = await request({
        ...this.opts,
        url: `${this.opts.base.webservice}/${this.opts.wsConfig.session}`,
        method: 'POST',
      });

      return {
        ...response,
        content: response.content.session.id,
      };
    } catch (e) {
      const error = {...e.response};
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
