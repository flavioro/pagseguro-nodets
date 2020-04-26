import { PagSeguroAddress } from './PagSeguroAddress';

export interface PagSeguroShipping {
  addressRequired: boolean;
  address?: PagSeguroAddress;
  type?: number;
  cost?: number;
}
