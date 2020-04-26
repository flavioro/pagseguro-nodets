import getClient from '../src/GetClient';
import testConfig from '../src/TestConfig';

describe('Connect', () => {
  it('success', () => {
    const client = getClient(testConfig.pagseguro);
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
      getClient();
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throw if invalid params', () => {
    const configError = { ...testConfig.pagseguro };
    delete configError.email;
    try {
      getClient(configError);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });
});
