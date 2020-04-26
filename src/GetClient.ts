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
import createLog from './CreateLog';

const getClient = (config?: PagSeguroConfig): PagSeguroClient => {
  if (!config || !validateConfig(config)) {
    throw new TypeError('Configurações PagSeguro inválidas');
  }
  const logger = createLog(config.logDir, config.debug);
  return {
    sessionService: new SessionService(config, logger),
    checkoutTransparente: {
      boletoService: new BoletoService(config, logger),
      cancelarTransacaoService: new CancelarTransacaoService(config, logger),
      cartaoCreditoService: new CartaoCreditoService(config, logger),
      consultarNotificaoService: new ConsultarNotificacaoService(
        config,
        logger
      ),
      consultarTransacaoService: new ConsultarTransacaoService(config, logger),
      consultarTransacoesService: new ConsultarTransacoesService(
        config,
        logger
      ),
      debitoOnlineService: new DebitoOnlineService(config, logger),
      estornarTransacaoService: new EstornarTransacaoService(config, logger),
    },
  };
};

export default getClient;
