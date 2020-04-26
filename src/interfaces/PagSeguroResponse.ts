import {Response} from 'request';

export interface PagSeguroResponse extends Response {
  content: any;
  status: string;
}
