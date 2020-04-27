import PagSeguroError from '../src/errors/PagSeguroError';
import { PagSeguroConfig } from '../src/interfaces/PagSeguroConfig';
import PagSeguro from '../src/PagSeguro';

describe('Session', () => {
  it('success', async () => {
    const client = PagSeguro.client({
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
    const { session } = await client.sessionService.getSession();

    expect(typeof session).toEqual('object');
    expect(session).toHaveProperty('id');
    expect(session.id).toHaveLength(32);
  });

  it('unauthorized', async () => {
    try {
      const configError: PagSeguroConfig = {
        email: 'q', // email da conta do pagseguro
        token: '2C233DAC692E48D7A30D4F5946FCA8E9', // token pagseguro
        appId: 'app5602760038', // ID da aplicação (pagamento recorrente)
        appKey: 'AA2A53776C6CD50444AA4FB9E9ADE13C', // Key da aplicação (pagemento recorrente)
        env: 'sandbox',
        logDir: `${__dirname}/log/pagseguro.log`,
        logConsole: false,
        notificationURL: 'http://localhost:3333/authorization/notification',
        redirectURL: 'http://localhost:3333/authorization/response',
      };
      await PagSeguro.client(configError).sessionService.getSession();
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('message', 'Unauthorized');
      expect(e).toHaveProperty('code', 401);
      expect(e).toHaveProperty('body');
      expect(Array.isArray(e.body)).toEqual(true);
    }
  });
});
