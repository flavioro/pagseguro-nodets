import { currency } from './CurrencyType';

export interface PagSeguroShipping {
  address: {
    street: string;
    number: number;
    complement?: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  type?: number;
  cost?: currency;
}
