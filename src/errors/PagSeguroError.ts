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
      if (!Array.isArray(content)) {
        content = [content];
      }
      this.content = content;
    }

    console.log('error', this.status, this.statusCode, this.content);
  }
}

export default PagSeguroError;
