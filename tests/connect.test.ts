import pagseguro from '../src';

describe('Connect', () => {
  it('success', () => {
    const client = pagseguro.connect(pagseguro.testConfig.pagseguro);
    expect(typeof client).toEqual('object');
    expect(client).toHaveProperty('session');
    expect(client).toHaveProperty('transaction');
  });

  it('throw if empty params', () => {
    try {
      pagseguro.connect();
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throw if invalid params', () => {
    const configError = { ...pagseguro.testConfig.pagseguro };
    delete configError.email;
    try {
      pagseguro.connect(configError);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });
});
