import { PagSeguroBoletoRequest } from './PagSeguroBoletoRequest';
import { PagSeguroDebitoOnlineRequest } from './PagSeguroDebitoOnlineRequest';
import { PagSeguroCartaoCreditoRequest } from './PagSeguroCartaoCreditoRequest';

export interface PagSeguroPayment
  extends PagSeguroBoletoRequest,
    PagSeguroDebitoOnlineRequest,
    PagSeguroCartaoCreditoRequest {
  mode: 'default';
  method: 'boleto' | 'eft' | 'creditCard';
  currency: 'BRL';
}
