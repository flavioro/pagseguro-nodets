import moment from 'moment';
import pagseguro from '../src';

let TRANSACTION_CODE: any = null;

describe('Transaction', () => {
  const client = pagseguro.connect(pagseguro.testConfig.pagseguro);

  it('boleto', async () => {
    const data = {...pagseguro.testConfig.payment};
    delete data.creditCard;
    delete data.bank;

    const response = await client.transaction.boleto(data);

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');

    TRANSACTION_CODE = response.content.code;
  });

  it('online debit', async () => {
    const response = await client.transaction.onlineDebit(
      pagseguro.testConfig.payment
    );

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');

    TRANSACTION_CODE = response.content.code;
  });

  /*
	TODO: get token?
	it('credit card', async function() {
        this.timeout(10000)

        const client = pagseguro.connect(config.pagseguro)
        const response = await client.transaction.creditCard(config.payment)

        expect(response).to.be.an('object')
        expect(response).to.have.property('statusCode', 200)
        expect(response).to.have.property('status', 'success')
        expect(response).to.have.property('content')
    })
	*/

  it('get', async () => {
    const response = await client.transaction.get(TRANSACTION_CODE);

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
  });

  it('search', async () => {
    const response = await client.transaction.search({
      initialDate: moment().subtract(1, 'day').format('YYYY-MM-DDTHH:mm'),
      maxPageResults: 20,
      page: 1,
    });

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
  });

  it('search by reference', async () => {
    const response = await client.transaction.search({
      reference: 'test_pagseguro_nodejs',
    });

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
  });

  it('notification', async () => {
    try {
      const notificationCode = '';
      await client.transaction.notification(notificationCode);
    } catch (e) {
      expect(typeof e).toEqual('object');
      expect(e).toHaveProperty('name', 'PagseguroError');
      expect(e).toHaveProperty('status', 'error');
      expect(e).toHaveProperty('statusCode', 400);
      expect(e).toHaveProperty('content');
      expect(Array.isArray(e.content)).toEqual(true);
    }
  });

  it('cancel', async () => {
    const response = await client.transaction.cancel(TRANSACTION_CODE);

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('status', 'success');
    expect(response).toHaveProperty('content');
  });
});
