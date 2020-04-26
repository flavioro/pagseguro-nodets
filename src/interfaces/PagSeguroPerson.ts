import { PagSeguroDocument } from './PagSeguroDocument';
import { PagSeguroPhone } from './PagSeguroPhone';
import { PagSeguroAddress } from './PagSeguroAddress';

export interface PagSeguroPerson {
  email?: string;
  type?: string;
  person?: {
    name?: string;
    documents?: PagSeguroDocument[];
    phones?: PagSeguroPhone[];
    address?: PagSeguroAddress;
  };
}
