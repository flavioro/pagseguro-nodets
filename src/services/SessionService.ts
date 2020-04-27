import PagSeguroError from '../errors/PagSeguroError';
import BaseService from './BaseService';

interface SessionResponse {
  session: {
    id: string;
  };
}

export default class SessionService extends BaseService {
  async getSession(): Promise<SessionResponse> {
    try {
      const response = await this.post<SessionResponse>(`/v2/sessions`, null, {
        headers: {
          'Content-Type': 'application/xml',
        },
        params: {
          email: this.config.email,
          token: this.config.token,
        },
      });
      return response.data;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
