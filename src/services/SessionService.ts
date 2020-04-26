import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../errors/PagSeguroError';
import BaseService from './BaseService';

interface SessionResponse extends Response {
  session: {
    id: string;
  };
}

export default class SessionService extends BaseService {
  async get(): Promise<SessionResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v2/sessions`,
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
