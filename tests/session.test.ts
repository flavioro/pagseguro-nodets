import PagSeguroError from '../src/errors/PagSeguroError';
import getClient from '../src/GetClient';
import testConfig from '../src/TestConfig';

describe('Session', async () => {
  await test('success', async () => {
    const client = getClient(testConfig.pagseguro);
    const session = await client.sessionService.get();

    expect(typeof session).toEqual('object');
    expect(session).toHaveProperty('content');
    expect(session.session).toHaveLength(32);
  });

  await test('unauthorized', async () => {
    try {
      const configError = {
        ...testConfig.pagseguro,
        email: '',
        token: '',
      };
      await getClient(configError).sessionService.get();
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
