import getClient from '../src/GetClient';
import testConfig from '../src/TestConfig';

describe('Connect', () => {
  it('success', () => {
    const client = getClient(testConfig.pagseguro);
    expect(typeof client).toEqual('object');
    expect(client).toHaveProperty('session');
    expect(client).toHaveProperty('transaction');
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
