import { AxiosResponse } from 'axios';
import Log from '../helper/Log';

class PagSeguroError extends Error {
  public readonly status: string;
  public readonly code: number;
  public readonly body: {
    code: number;
    message?: string;
  }[];

  constructor({ statusText, status, data }: AxiosResponse) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = statusText || 'error';
    this.code = status || 500;
    this.body = [];

    if (data) {
      if (!Array.isArray(data)) {
        data = [data];
      }
      this.body = data;
    }

    Log.error(this);
  }
}

export default PagSeguroError;
