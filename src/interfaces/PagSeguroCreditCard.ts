import { currency } from './CurrencyType';

export interface PagSeguroCreditCard {
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
}
