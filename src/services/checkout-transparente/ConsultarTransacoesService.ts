import PagSeguroError from '../../errors/PagSeguroError';
import BaseService from '../BaseService';
import { PagSeguroTransaction } from '../../interfaces/PagSeguroTransaction';

interface ConsultarTransacoesRequest {
  reference: string;
  initialDate: Date;
  finalDate: Date;
  page: number;
  maxPageResults: number;
}

interface ConsultarTransacoesResponse {
  transactionSearchResult: {
    date: Date;
    currentPage: number;
    resultsInThisPage: number;
    totalPages: number;
    transactions: {
      transaction: PagSeguroTransaction[];
    };
  };
}

export default class ConsultarTransacoesService extends BaseService {
  async find({
    reference,
    initialDate,
    finalDate,
    page,
    maxPageResults,
  }: ConsultarTransacoesRequest): Promise<ConsultarTransacoesResponse> {
    try {
      const response = await this.get<ConsultarTransacoesResponse>(
        `/v3/transactions`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            email: this.config.email,
            token: this.config.token,
            reference,
            initialDate,
            finalDate,
            page,
            maxPageResults,
          },
        }
      );
      return response.data;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
