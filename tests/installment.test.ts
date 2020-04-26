import pagseguro from '../src';
import PagSeguroError from '../src/errors/PagSeguroError';

describe('Installment', () => {
  it('success', async () => {
    const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
    const response = await client.installment.get({
      amount: 30.0,
      cardBrand: 'visa',
      maxInstallmentNoInterest: 2,
    });

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
    expect(Array.isArray(response.content)).toEqual(true);
  });

  it('invalid cardBrand', async () => {
    try {
      const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
      await client.installment.get({
        amount: 30.0,
        cardBrand: 'other',
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
      const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
      await client.installment.get({
        amount: null,
        cardBrand: 'visa',
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
      const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
      await client.installment.get({
        amount: 12.0,
        cardBrand: 'visa',
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
