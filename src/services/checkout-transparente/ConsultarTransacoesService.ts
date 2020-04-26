import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransactionResponse } from '../../interfaces/PagSeguroTransactionResponse';

interface ConsultarTransacoesRequest {
  reference: string;
  initialDate: Date;
  finalDate: Date;
  page: number;
  maxPageResults: number;
}

interface ConsultarTransacoesResponse extends Response {
  transactionSearchResult: {
    date: Date;
    currentPage: number;
    resultsInThisPage: number;
    totalPages: number;
    transactions: {
      transaction: PagSeguroTransactionResponse[];
    };
  };
}

export default class ConsultarTransacoesService extends BaseService {
  async get({
    reference,
    initialDate,
    finalDate,
    page,
    maxPageResults,
  }: ConsultarTransacoesRequest): Promise<ConsultarTransacoesResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.config.email,
          token: this.config.token,
          reference,
          initialDate,
          finalDate,
          page,
          maxPageResults,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        transform: this.transformResponseXmlToJson,
        url: `${this.api}/v3/transactions`,
        method: 'GET',
      });

      return {
        ...response,
        transactionSearchResult: response.content.transactionSearchResult,
      };
    } catch ({ response }) {
      const { status, statusText, content } = response;
      throw new PagSeguroError(status, statusText, content);
    }
  }
}
