import { PagSeguroConfig } from './interfaces/PagSeguroConfig';
import { PagSeguroClient } from './interfaces/PagSeguroClient';
import SessionService from './services/SessionService';
import BoletoService from './services/checkout-transparente/BoletoService';
import CancelarTransacaoService from './services/checkout-transparente/CancelarTransacaoService';
import CartaoCreditoService from './services/checkout-transparente/CartaoCreditoService';
import ConsultarNotificacaoService from './services/checkout-transparente/ConsultarNotificacaoService';
import ConsultarTransacaoService from './services/checkout-transparente/ConsultarTransacaoService';
import ConsultarTransacoesService from './services/checkout-transparente/ConsultarTransacoesService';
import DebitoOnlineService from './services/checkout-transparente/DebitoOnlineService';
import EstornarTransacaoService from './services/checkout-transparente/EstornarTransacaoService';
import validateConfig from './helper/ValidateConfig';

const pagSeguro = (config?: PagSeguroConfig): PagSeguroClient => {
  if (!config || !validateConfig(config)) {
    throw new TypeError('Configurações PagSeguro inválidas');
  }

  return {
    sessionService: new SessionService(config),
    checkoutTransparente: {
      boletoService: new BoletoService(config),
      cancelarTransacaoService: new CancelarTransacaoService(config),
      cartaoCreditoService: new CartaoCreditoService(config),
      consultarNotificaoService: new ConsultarNotificacaoService(config),
      consultarTransacaoService: new ConsultarTransacaoService(config),
      consultarTransacoesService: new ConsultarTransacoesService(config),
      debitoOnlineService: new DebitoOnlineService(config),
      estornarTransacaoService: new EstornarTransacaoService(config),
    },
  };
};

export default pagSeguro;
