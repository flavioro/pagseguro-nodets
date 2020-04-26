import { currency } from './CurrencyType';

export interface PagSeguroItem {
  id: number | string;
  description: string;
  quantity: number;
  amount: currency;
}
