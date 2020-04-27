import PagSeguroError from '../src/errors/PagSeguroError';
import pagSeguro from '../src/PagSeguro';
import testConfig from '../src/TestConfig';

describe('Session', () => {
  it('success', async () => {
    const client = pagSeguro(testConfig.pagseguro);
    const { session } = await client.sessionService.getSession();

    expect(typeof session).toEqual('object');
    expect(session).toHaveProperty('id');
    expect(session.id).toHaveLength(32);
  });

  it('unauthorized', async () => {
    try {
      const configError = {
        ...testConfig.pagseguro,
        email: 'q',
        token: 'a',
      };
      await pagSeguro(configError).sessionService.getSession();
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'Unauthorized');
      expect(e).toHaveProperty('code', 401);
      expect(e).toHaveProperty('body');
      expect(Array.isArray(e.body)).toEqual(true);
    }
  });
});
