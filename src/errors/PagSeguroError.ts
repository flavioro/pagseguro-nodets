import PagSeguroErrorCodes from './PagSeguroErrorCodes';
import { PagSeguroResponse } from '../interfaces/PagSeguroResponse';

class PagSeguroError extends Error {
  public readonly status: string;
  public readonly statusCode: number;
  public readonly content: any[] | undefined;

  constructor({ status, statusCode, content }: PagSeguroResponse) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status || 'error';
    this.statusCode = statusCode || 500;

    if (content) {
      const localeError = (error: { code: any; message?: any }) => {
        return {
          ...error,
          message: PagSeguroErrorCodes[error.code] || error.message,
        };
      };

      if (Array.isArray(content)) {
        this.content = content.map(localeError);
      } else if (content.code) {
        this.content = [localeError(content)];
      }
    }
  }
}

export default PagSeguroError;
