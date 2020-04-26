import PagSeguroError from '../src/errors/PagSeguroError';
import getClient from '../src/GetClient';
import testConfig from '../src/TestConfig';

describe('Installment', async () => {
  const client = getClient(testConfig.pagseguro);
  const { session } = await client.sessionService.get();

  it('success', async () => {
    const response = await client.installmentService.get({
      sessionId: session.id,
      amount: 30.0,
      creditCardBrand: 'visa',
      maxInstallmentNoInterest: 2,
    });

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
    expect(Array.isArray(response.installments)).toEqual(true);
  });

  it('invalid cardBrand', async () => {
    try {
      await client.installmentService.get({
        sessionId: session.id,
        amount: 30.0,
        creditCardBrand: 'other',
        maxInstallmentNoInterest: 2,
      });
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 400);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });

  it('invalid amount', async () => {
    try {
      await client.installmentService.get({
        sessionId: session.id,
        amount: 25.989,
        creditCardBrand: 'visa',
        maxInstallmentNoInterest: 2,
      });
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 400);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });

  it('invalid maxInstallmentNoInterest', async () => {
    try {
      await client.installmentService.get({
        sessionId: session.id,
        amount: 12.0,
        creditCardBrand: 'visa',
        maxInstallmentNoInterest: 2222,
      });
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 400);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });
});
