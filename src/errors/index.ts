import errors from './errors';

class PagSeguroError extends Error {
  public readonly status: string;
  public readonly statusCode: number;
  public readonly content: any[] | undefined;

  constructor(e: {
    status: string;
    statusCode: number;
    content: { code: any } | null;
  }) {
    super();
    Object.setPrototypeOf(this, PagSeguroError);

    this.status = e.status || 'error';
    this.statusCode = e.statusCode || 500;

    if (e.content) {
      const localeError = (error: { code: any; message?: any }) => {
        return {
          ...error,
          message: errors[error.code] || error.message,
        };
      };

      if (Array.isArray(e.content)) {
        this.content = e.content.map(localeError);
      } else if (e.content.code) {
        this.content = [localeError(e.content)];
      }
    }
  }
}

export default PagSeguroError;
