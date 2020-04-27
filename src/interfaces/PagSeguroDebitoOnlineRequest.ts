import { PagSeguroBoletoRequest } from './PagSeguroBoletoRequest';
import { PagSeguroBank } from './PagSeguroBank';

export interface PagSeguroDebitoOnlineRequest extends PagSeguroBoletoRequest {
  bank: PagSeguroBank;
}
