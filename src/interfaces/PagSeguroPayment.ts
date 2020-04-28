import { PagSeguroBoletoRequest } from './PagSeguroBoletoRequest';
import { PagSeguroBank } from './PagSeguroBank';
import { PagSeguroCreditCard } from './PagSeguroCreditCard';

export interface PagSeguroPayment extends PagSeguroBoletoRequest {
  mode: 'default';
  method: 'boleto' | 'eft' | 'creditCard';
  currency: 'BRL';
  bank?: PagSeguroBank;
  creditCard?: PagSeguroCreditCard;
}
