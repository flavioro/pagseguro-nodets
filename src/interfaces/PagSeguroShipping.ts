import { PagSeguroAddress } from './PagSeguroAddress';

export interface PagSeguroShipping extends PagSeguroAddress {
  type?: number;
  cost?: number;
}
