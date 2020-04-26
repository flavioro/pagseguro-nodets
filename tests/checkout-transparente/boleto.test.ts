import testConfig from '../../src/TestConfig';
import getClient from '../../src/GetClient';

describe('Transaction', () => {
  const client = getClient(testConfig.pagseguro);

  it('boleto', async () => {
    const data = testConfig.payment;

    const response = await client.checkoutTransparente.boletoService.transaction(
      {
        sender: data.sender,
        items: data.items,
        extraAmount: data.extraAmount,
        reference: 'checkout-transparente/boleto.test.ts',
        shipping: data.shipping,
      }
    );

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
  });
});
