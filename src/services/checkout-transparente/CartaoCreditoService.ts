import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../../interfaces/PagSeguroRequestOptions';
import { jsonToXml } from '../../helper/utils';
import { PagSeguroSender } from '../../interfaces/PagSeguroSender';
import { PagSeguroItem } from '../../interfaces/PagSeguroItem';
import { PagSeguroShipping } from '../../interfaces/PagSeguroShipping';

interface CartaoCreditoRequest {
  sender: PagSeguroSender;
  notificationURL?: string;
  items: {
    item: PagSeguroItem;
  }[];
  extraAmount?: number;
  reference?: string;
  shipping: PagSeguroShipping;
  creditCard: {
    installment: {
      quantity: number;
      value: number;
      noInterestInstallmentQuantity: string;
    };
    holder: {
      name: string;
      documents: {
        document: {
          type: string;
          value: string;
        };
      }[];
      birthDate: string;
      phone: {
        areaCode: string;
        number: string;
      };
    };
    billingAddress: {
      street: string;
      number: number;
      complement?: string;
      district: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
}

interface CartaoCreditoResponse extends Response {
  transaction: {
    date: Date;
    code: string;
    reference: string;
    type: number;
    status: number;
    lastEventDate: Date;
    paymentMethod: {
      type: number;
      code: number;
    };
    grossAmount: number;
    discontAmount: number;
    feeAmount: number;
    netAmount: number;
    extraAmount: number;
    installmentCount: number;
    itemCount: number;
    items: {
      item: PagSeguroItem;
    }[];
    sender: PagSeguroSender;
    shipping: PagSeguroShipping;
    gatewaySystem: {
      type: string;
      authorizationCode: number;
      nsu: number;
      tid: number;
      establishmentCode: number;
      acquirerName: string;
    };
  };
}

export default class CartaoCreditoService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async transaction(
    request: CartaoCreditoRequest
  ): Promise<CartaoCreditoResponse> {
    try {
      const response = await requestPromise({
        qs: {
          email: this.opts.config.email,
          token: this.opts.config.token,
        },
        headers: {
          'Content-Type': 'application/xml',
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v2/transactions`,
        method: 'POST',
        body: jsonToXml({
          payment: {
            ...request,
            mode: 'default',
            method: 'creditCard',
            currency: 'BRL',
          },
        }),
      });

      return {
        ...response,
        transaction: response.content.transaction,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
