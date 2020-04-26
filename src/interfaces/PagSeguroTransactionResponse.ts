import { currency } from './CurrencyType';
import { PagSeguroItem } from './PagSeguroItem';
import { PagSeguroSender } from './PagSeguroSender';
import { PagSeguroShipping } from './PagSeguroShipping';

export interface PagSeguroTransactionResponse {
  date: Date;
  code: string;
  reference: string;
  type: number;
  status: number;
  lastEventDate: Date;
  paymentMethod: {
    type: number;
    code: number;
  };
  paymentLink: string;
  grossAmount: currency;
  discontAmount: currency;
  feeAmount: currency;
  netAmount: currency;
  extraAmount: currency;
  installmentCount: number;
  itemCount: number;
  items: {
    item: PagSeguroItem[];
  };
  sender: PagSeguroSender;
  shipping: PagSeguroShipping;
  creditorFees: {
    operationalFeeAmount: number;
    intermediationRateAmount: number;
    intermediationFeeAmount: number;
  };
  primaryReceiver: {
    publicKey: string;
  };
  gatewaySystem: {
    type: string;
    authorizationCode: number;
    nsu: number;
    tid: number;
    establishmentCode: number;
    acquirerName: string;
  };
}
