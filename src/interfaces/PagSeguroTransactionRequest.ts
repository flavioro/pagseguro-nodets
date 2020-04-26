import { PagSeguroItem } from './PagSeguroItem';
import { PagSeguroSender } from './PagSeguroSender';
import { PagSeguroShipping } from './PagSeguroShipping';
import { currency } from './CurrencyType';

export interface PagSeguroTransactionRequest {
  sender: PagSeguroSender;
  items: {
    item: PagSeguroItem[];
  };
  extraAmount?: currency;
  reference?: string;
  notificationURL?: string;
  shipping: PagSeguroShipping;

  bank?: {
    name: 'bradesco' | 'itau' | 'bancodobrasil' | 'banrisul';
  };
  creditCard?: {
    token: string;
    installment: {
      quantity: number;
      value: currency;
      noInterestInstallmentQuantity?: string;
    };
    holder: {
      name: string;
      documents: {
        document: {
          type: string;
          value: string;
        }[];
      };
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
