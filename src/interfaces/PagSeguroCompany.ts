import {PagSeguroDocument} from './PagSeguroDocument';
import {PagSeguroPhone} from './PagSeguroPhone';
import {PagSeguroAddress} from './PagSeguroAddress';

export interface PagSeguroCompany {
  email?: string;
  type?: string;
  company?: {
    name?: string;
    displayName?: string;
    websiteURL?: string;
    documents?: PagSeguroDocument[];
    partner?: {
      name?: string;
      documents?: PagSeguroDocument[];
      phones?: PagSeguroPhone[];
      birthDate?: string;
    };
    phones?: PagSeguroPhone[];
    address?: PagSeguroAddress;
  };
}
