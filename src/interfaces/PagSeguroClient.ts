import SessionService from '../services/SessionService';
import BoletoService from '../services/checkout-transparente/BoletoService';
import CancelarTransacaoService from '../services/checkout-transparente/CancelarTransacaoService';
import CartaoCreditoService from '../services/checkout-transparente/CartaoCreditoService';
import ConsultarNotificacaoService from '../services/checkout-transparente/ConsultarNotificacaoService';
import ConsultarTransacaoService from '../services/checkout-transparente/ConsultarTransacaoService';
import ConsultarTransacoesService from '../services/checkout-transparente/ConsultarTransacoesService';
import DebitoOnlineService from '../services/checkout-transparente/DebitoOnlineService';
import EstornarTransacaoService from '../services/checkout-transparente/EstornarTransacaoService';

export interface PagSeguroClient {
  sessionService: SessionService;
  checkoutTransparente: {
    boletoService: BoletoService;
    cancelarTransacaoService: CancelarTransacaoService;
    cartaoCreditoService: CartaoCreditoService;
    consultarNotificaoService: ConsultarNotificacaoService;
    consultarTransacaoService: ConsultarTransacaoService;
    consultarTransacoesService: ConsultarTransacoesService;
    debitoOnlineService: DebitoOnlineService;
    estornarTransacaoService: EstornarTransacaoService;
  };
}
