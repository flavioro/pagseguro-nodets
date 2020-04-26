import PagSeguroError from '../src/errors/PagSeguroError';
import getClient from '../src/GetClient';
import testConfig from '../src/TestConfig';

describe('Authorization', async () => {
  const client = getClient(testConfig.pagseguro);

  it('success', async () => {
    const response = await client.authorizationService.request({});

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
    expect(response).toHaveProperty('code');
    expect(response.code).toHaveLength(32);
  });

  it('unauthorized', async () => {
    try {
      const configError = {
        ...testConfig.pagseguro,
        appId: '',
        appKey: '',
        redirectURL: '',
      };
      await getClient(configError).authorizationService.request({});
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toBeInstanceOf(PagSeguroError);
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 400);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });

  // it.only('unsing person account', async function() {
  //
  //     const client = pagseguro.connect(api.pagseguro)
  //
  //     const params = {
  //         ...this.params,
  //         account: api.person
  //     }
  //
  //     // console.log(params)
  //
  //     const response = await client.authorization.request(params)
  //
  //     expect(response).to.have.property('statusCode', 200)
  //     expect(response).to.have.property('status', 'success')
  //     expect(response).to.have.property('content')
  //     expect(response.content.code).to.have.length(32);
  // })
});
