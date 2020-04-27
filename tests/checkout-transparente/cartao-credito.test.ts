import pagSeguro from '../../src/PagSeguro';
import { Currency } from '../../src/interfaces/CurrencyType';

describe('Cartão Credito', () => {
  const client = pagSeguro({
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

  it('sucess', async () => {
    const response = await client.checkoutTransparente.cartaoCreditoService.transaction(
      {
        sender: {
          name: 'Victor Hugo',
          email: 'c91591689132102051158@sandbox.pagseguro.com.br',
          phone: {
            areaCode: '48',
            number: '999048349',
          },
          documents: {
            document: [
              {
                type: 'CPF',
                value: '02722185296',
              },
            ],
          },
        },
        items: {
          item: [
            {
              id: '1',
              description: 'Produto 1',
              quantity: 2,
              amount: new Currency(2),
            },
            {
              id: '2',
              description: 'Produto 2',
              quantity: 1,
              amount: new Currency(60.0),
            },
            {
              id: '3',
              description: 'Produto 3',
              quantity: 2,
              amount: new Currency(20.0),
            },
          ],
        },
        extraAmount: new Currency(10.0),
        reference: 'checkout-transparente/cartao-credito.test.ts',
        shipping: {
          address: {
            street: 'Rua Julio de Oliveira',
            number: 194,
            complement: 'Casa',
            district: 'Termas',
            city: 'Gravatal',
            state: 'SC',
            country: 'BRA',
            postalCode: '88735000',
          },
          type: 1,
          cost: new Currency(25.0),
        },
        creditCard: {
          token: '145f6d8e4e564ea1a624bb4eb7f4fce0', // see /htmlTests/generateCardToken.html
          holder: {
            name: 'Victor Hugo',
            phone: {
              areaCode: '48',
              number: '999048349',
            },
            documents: {
              document: [
                {
                  type: 'CPF',
                  value: '02722185296',
                },
              ],
            },
            birthDate: '27/06/1998',
          },
          installment: {
            quantity: 1,
            value: new Currency(139),
          },
          billingAddress: {
            street: 'Rua Julio de Oliveira',
            number: 194,
            complement: 'Casa',
            district: 'Termas',
            city: 'Gravatal',
            state: 'SC',
            country: 'BRA',
            postalCode: '88735000',
          },
        },
      }
    );

    expect(typeof response).toEqual('object');
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('gatewaySystem');

    console.log(response);
  });
});
