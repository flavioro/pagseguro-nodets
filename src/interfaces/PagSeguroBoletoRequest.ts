import { PagSeguroItem } from './PagSeguroItem';
import { PagSeguroSender } from './PagSeguroSender';
import { PagSeguroShipping } from './PagSeguroShipping';
import { currency } from './CurrencyType';
import { PagSeguroBank } from './PagSeguroBank';
import { PagSeguroCreditCard } from './PagSeguroCreditCard';

export interface PagSeguroBoletoRequest {
  sender: PagSeguroSender;
  items: {
    item: PagSeguroItem[];
  };
  extraAmount?: currency;
  reference?: string;
  notificationURL?: string;
  shipping: PagSeguroShipping;
  bank?: PagSeguroBank;
  creditCard?: PagSeguroCreditCard;
}
