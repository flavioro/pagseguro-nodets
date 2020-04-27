import pagSeguro from '../src/PagSeguro';
import { PagSeguroConfig } from '../src/interfaces/PagSeguroConfig';

describe('Pagseguro', () => {
  it('success', () => {
    const client = pagSeguro({
      email: 'vhmf171@hotmail.com', // email da conta do pagseguro
      token: '2C233DAC692E48D7A30D4F5946FCA8E9', // token pagseguro
      appId: 'app5602760038', // ID da aplicação (pagamento recorrente)
      appKey: 'AA2A53776C6CD50444AA4FB9E9ADE13C', // Key da aplicação (pagemento recorrente)
      env: 'sandbox',
      logDir: `${__dirname}/log/pagseguro.log`,
      logConsole: false,
      notificationURL: 'http://localhost:3333/authorization/notification',
      redirectURL: 'http://localhost:3333/authorization/response',
    });
    expect(typeof client).toEqual('object');
    expect(client).toHaveProperty('sessionService');
    expect(client).toHaveProperty('checkoutTransparente');

    const { checkoutTransparente } = client;
    expect(checkoutTransparente).toHaveProperty('boletoService');
    expect(checkoutTransparente).toHaveProperty('cancelarTransacaoService');
    expect(checkoutTransparente).toHaveProperty('cartaoCreditoService');
    expect(checkoutTransparente).toHaveProperty('consultarNotificaoService');
    expect(checkoutTransparente).toHaveProperty('consultarTransacaoService');
    expect(checkoutTransparente).toHaveProperty('consultarTransacoesService');
    expect(checkoutTransparente).toHaveProperty('debitoOnlineService');
    expect(checkoutTransparente).toHaveProperty('estornarTransacaoService');
  });

  it('throw if empty params', () => {
    try {
      pagSeguro();
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throw if invalid params', () => {
    const configError: PagSeguroConfig = {
      email: 'vhmf171@hotmail.com', // email da conta do pagseguro
      token: '2C233DAC692E48D7A30D4F5946FCA8E9', // token pagseguro
      appId: 'app5602760038', // ID da aplicação (pagamento recorrente)
      appKey: 'AA2A53776C6CD50444AA4FB9E9ADE13C', // Key da aplicação (pagemento recorrente)
      env: 'sandbox',
      logDir: `${__dirname}/log/pagseguro.log`,
      logConsole: false,
      notificationURL: 'http://localhost:3333/authorization/notification',
      redirectURL: 'http://localhost:3333/authorization/response',
    };
    delete configError.email;
    try {
      pagSeguro(configError);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });
});
