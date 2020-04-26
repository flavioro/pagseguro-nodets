import { currency } from './CurrencyType';

export interface PagSeguroItem {
  id: number;
  description: string;
  quantity: number;
  amount: currency;
}
