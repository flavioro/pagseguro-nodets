import {PagSeguroSender} from './PagSeguroSender';

export interface PagSeguroHolder extends PagSeguroSender {
  birthDate?: string;
}
