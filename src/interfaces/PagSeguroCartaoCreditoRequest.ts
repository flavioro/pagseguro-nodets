import { PagSeguroBoletoRequest } from './PagSeguroBoletoRequest';
import { PagSeguroCreditCard } from './PagSeguroCreditCard';

export interface PagSeguroCartaoCreditoRequest extends PagSeguroBoletoRequest {
  creditCard: PagSeguroCreditCard;
}
