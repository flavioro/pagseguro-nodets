import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../interfaces/PagSeguroRequestOptions';
import { PagSeguroInstallment } from '../interfaces/PagSeguroInstallment';

interface InstallmentRequest {
  amount: number | string;
  creditCardBrand: string;
  maxInstallmentNoInterest: number;
  sessionId: string;
}

interface InstallmentResponse extends Response {
  installments: PagSeguroInstallment[];
}

/**
 * Este serviço é utilizado em:
 * MODELO DE APLICAÇÕES;
 * SPLIT DE PAGAMENTO;
 */
export default class InstallmentService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async get({
    amount,
    creditCardBrand,
    maxInstallmentNoInterest,
    sessionId,
  }: InstallmentRequest): Promise<InstallmentResponse> {
    if (amount && typeof amount !== 'string' && amount.toFixed) {
      amount = amount.toFixed(2);
    }

    try {
      const response = await requestPromise({
        qs: {
          amount,
          creditCardBrand,
          maxInstallmentNoInterest,
          sessionId,
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v2/installments`,
        method: 'GET',
      });

      const installments = response.content?.installments || [];

      return {
        ...response,
        installments,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
