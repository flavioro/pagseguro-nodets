import PagSeguroErrorCodes from './PagSeguroErrorCodes';

interface PagSeguroErrorContent {
  code: number;
  message?: string;
}

class PagSeguroError extends Error {
  public readonly status: string;
  public readonly statusCode: number;
  public readonly content: PagSeguroErrorContent[];

  constructor(
    status: string,
    statusCode: number,
    content: PagSeguroErrorContent | PagSeguroErrorContent[]
  ) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status || 'error';
    this.statusCode = statusCode || 500;
    this.content = [];

    if (content) {
      const localeError = (
        error: PagSeguroErrorContent
      ): PagSeguroErrorContent => {
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
