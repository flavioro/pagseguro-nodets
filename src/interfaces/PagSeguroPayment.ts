import { PagSeguroTransactionRequest } from './PagSeguroTransactionRequest';

export interface PagSeguroPayment extends PagSeguroTransactionRequest {
  mode: 'default';
  method: 'boleto' | 'eft' | 'creditCard';
  currency: 'BRL';
}
