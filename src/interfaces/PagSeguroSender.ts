import {PagSeguroDocument} from './PagSeguroDocument';
import {PagSeguroPhone} from './PagSeguroPhone';

export interface PagSeguroSender {
  ip?: string;
  name?: string;
  email?: string;
  phone?: PagSeguroPhone;
  document?: PagSeguroDocument;
  documents?: PagSeguroDocument[];
}
