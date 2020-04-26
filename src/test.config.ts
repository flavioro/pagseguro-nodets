/**
 * pagseguro
 */
import { PagSeguroAccount } from './interfaces/PagSeguroAccount';
import { PagSeguroSender } from './interfaces/PagSeguroSender';
import { PagSeguroAddress } from './interfaces/PagSeguroAddress';
import { PagSeguroBilling } from './interfaces/PagSeguroBilling';
import { PagSeguroShipping } from './interfaces/PagSeguroShipping';
import { PagSeguroItem } from './interfaces/PagSeguroItem';
import { PagSeguroHolder } from './interfaces/PagSeguroHolder';
import { PagSeguroInstallment } from './interfaces/PagSeguroInstallment';
import { PagSeguroPerson } from './interfaces/PagSeguroPerson';
import { PagSeguroCompany } from './interfaces/PagSeguroCompany';
import { PagSeguroConfig } from './interfaces/PagSeguroConfig';

const pagseguro: PagSeguroConfig = {
  email: 'vhmf171@hotmail.com', // email da conta do pagseguro
  token: '2C233DAC692E48D7A30D4F5946FCA8E9', // token pagseguro
  appId: 'app5602760038', // ID da aplicação (pagamento recorrente)
  appKey: 'AA2A53776C6CD50444AA4FB9E9ADE13C', // Key da aplicação (pagemento recorrente)
  env: 'sandbox',
  log: `${__dirname}/log/pagseguro.log`,
  debug: false,
  notificationURL: 'http://localhost:3333/authorization/notification',
  redirectURL: 'http://localhost:3333/authorization/response',
};

/**
 * acounts
 * @link https://sandbox.pagseguro.uol.com.br/aplicacao/configuracoes.html
 */
const accounts: PagSeguroAccount[] = [
  {
    name: 'Vendedor 01',
    email: 'v70979766516657201987@sandbox.pagseguro.com.br',
    password: 'hEC2xdfKUe5kJ5K2',
    publicKey: 'PUBDB60C4CEB2C842E5B693F33457348F4B',
  },
  {
    name: 'Vendedor 02',
    email: 'v02640470520081486074@sandbox.pagseguro.com.br',
    password: '66496861m48946Le',
    publicKey: 'PUB1528CEE880794C44B3AA3A7B05735F36',
  },
  {
    name: 'Vendedor 03',
    email: 'v63754688317987160638@sandbox.pagseguro.com.br',
    password: '55200244699H4D68',
    publicKey: 'PUB529A91CA8FD4469FA9A857EC5611ECAE',
  },
];

/**
 * sender
 */
const sender: PagSeguroSender = {
  name: 'Victor Hugo',
  email: 'c91591689132102051158@sandbox.pagseguro.com.br',
  phone: {
    areaCode: '48',
    number: '999048349',
  },
  document: {
    type: 'CPF',
    value: '02722185296',
  },
};

/**
 * address
 */
const address: PagSeguroAddress = {
  street: 'Rua Julio de Oliveira',
  number: 194,
  complement: 'Casa',
  district: 'Termas',
  city: 'Gravatal',
  state: 'SC',
  country: 'BRA',
  postalCode: '88735000',
};

/**
 * billing
 */
const billing: PagSeguroBilling = { ...address };

/**
 * shipping
 */
const shipping: PagSeguroShipping = {
  ...address,
  type: 1,
  cost: 25.0,
};

/**
 * items
 */
const items: PagSeguroItem[] = [
  {
    id: 1,
    description: 'Produto 1',
    quantity: 2,
    amount: 2,
  },
  {
    id: 2,
    description: 'Produto 2',
    quantity: 1,
    amount: 60.0,
  },
  {
    id: 3,
    description: 'Produto 3',
    quantity: 2,
    amount: 20.0,
  },
];

/**
 * holder
 */
const holder: PagSeguroHolder = {
  ...sender,
  birthDate: '27/06/1998',
};

/**
 * installment
 */
const installment: PagSeguroInstallment = {
  installmentAmount: 124,
  interestFree: true,
  quantity: 1,
  totalAmount: 124.0,
};

/**
 * person
 */
const person: PagSeguroPerson = {
  email: accounts[0].email,
  type: 'SELLER',
  person: {
    name: accounts[0].name,
    documents: [
      {
        type: 'CPF',
        value: '18974411008',
      },
    ],
    phones: [
      {
        type: 'MOBILE',
        areaCode: '48',
        number: '91510980',
      },
      {
        type: 'HOME',
        areaCode: '48',
        number: '32091243',
      },
    ],
    address,
  },
};

/**
 * company
 */
const company: PagSeguroCompany = {
  email: accounts[1].email,
  type: 'COMPANY',
  company: {
    name: accounts[1].name,
    displayName: 'Atah Digital',
    websiteURL: 'http://atah.com.br',
    documents: [
      {
        type: 'CNPJ',
        value: '17302417000101',
      },
    ],
    partner: {
      name: 'Willy Chagas',
      documents: [
        {
          type: 'CPF',
          value: '18974411008',
        },
      ],
      birthDate: '22/02/1989',
    },
    phones: [
      {
        type: 'BUSINESS',
        areaCode: '48',
        number: '91510980',
      },
      {
        type: 'BUSINESS',
        areaCode: '48',
        number: '32091243',
      },
    ],
    address,
  },
};

const authorization = {
  permissions: [
    'CREATE_CHECKOUTS',
    'SEARCH_TRANSACTIONS',
    'RECEIVE_TRANSACTION_NOTIFICATIONS',
    'MANAGE_PAYMENT_PRE_APPROVALS',
    'DIRECT_PAYMENT',
  ],

  redirecURL: 'http://domain.com',
  notificationURL: 'http://domain.com',
};

/**
 * exports
 */
export default {
  authorization,
  pagseguro,
  accounts,
  person,
  company,
  payment: {
    bank: {
      name: 'itau',
    },
    creditCard: {
      holder,
      installment,
      maxInstallmentNoInterest: 0,
      token: '',
    },
    extraAmount: 10.0,
    reference: 'test_pagseguro_nodejs',
    sender,
    shipping,
    billing,
    items,
  },
};
