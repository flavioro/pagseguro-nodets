import { Response } from 'request';
import Log from '../Log';

class PagSeguroError extends Error {
  public readonly status: string;
  public readonly code: number;
  public readonly body: {
    code: number;
    message?: string;
  }[];

  constructor({ statusMessage, statusCode, body }: Response) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = statusMessage || 'error';
    this.code = statusCode || 500;
    this.body = [];

    if (body) {
      if (!Array.isArray(body)) {
        body = [body];
      }
      this.body = body;
    }

    Log.error(this);
  }
}

export default PagSeguroError;
