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
  async getSession(): Promise<SessionResponse> {
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
        session: response.body.session,
      };
    } catch ({ response }) {
      if (response.body && response.body === 'Unauthorized') {
        response.body = [
          {
            code: 401,
            message: 'Unauthorized',
          },
        ];
      }
      throw new PagSeguroError(response);
    }
  }
}
