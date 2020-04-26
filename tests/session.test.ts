import pagseguro from '../src';
import PagSeguroError from '../src/errors/PagSeguroError';

describe('Session', () => {
  test('success', async () => {
    const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
    const session = await client.openSession.get();

    expect(typeof session).toEqual('object');
    expect(session).toHaveProperty('content');
    expect(session.content).toHaveLength(32);
  });

  test('unauthorized', async () => {
    try {
      const configError = {
        ...pagseguro.testConfig.pagseguro,
        email: '',
        token: '',
      };
      const client = pagseguro.connect(configError);
      await client.openSession.get();
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 401);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });
});
