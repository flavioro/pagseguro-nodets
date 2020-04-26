import SessionService from '../services/SessionService';
import InstallmentService from '../services/InstallmentService';
import BoletoService from '../services/checkout-transparente/BoletoService';
import AuthorizationService from '../services/AuthorizationService';

export interface PagSeguroClient {
  sessionService: SessionService;
  installmentService: InstallmentService;
  authorizationService: AuthorizationService;
  checkoutTransparente: {
    boletoService: BoletoService;
  };
}
