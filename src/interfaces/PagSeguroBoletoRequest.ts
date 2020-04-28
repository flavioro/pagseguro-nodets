import { PagSeguroItem } from './PagSeguroItem';
import { PagSeguroSender } from './PagSeguroSender';
import { PagSeguroShipping } from './PagSeguroShipping';
import { currency } from './CurrencyType';

export interface PagSeguroBoletoRequest {
  sender: PagSeguroSender;
  items: {
    item: PagSeguroItem[];
  };
  extraAmount?: currency;
  reference?: string;
  notificationURL?: string;
  shipping: PagSeguroShipping;
}
