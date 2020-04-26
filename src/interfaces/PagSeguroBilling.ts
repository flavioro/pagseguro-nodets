import {PagSeguroAddress} from './PagSeguroAddress';

export interface PagSeguroBilling extends PagSeguroAddress {
  type?: number;
}
