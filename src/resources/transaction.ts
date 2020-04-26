import request from 'request-promise';
import clone from 'clone';
import api from '../config/api';
import PagSeguroError from '../errors/PagSeguroError';
import format from '../format';

/**
 * formatRequestParams
 * @param {Object} opts
 * @param {Object} params
 * @return {Object}
 */
const formatRequestParams = (opts: any, { ...params }: any) => {
  params.currency = 'BRL';
  params.shipping = format.shipping(params.shipping);
  params.sender = format.sender(params.sender);
  params.extraAmount = format.extraAmount(params.extraAmount);
  params.creditCard = format.creditCard(params.creditCard, params);
  params.billing = format.billing(params.billing);
  params.items = format.items(params.items);

  if (params.hasOwnProperty('receivers')) {
    params.receivers = format.receivers(params.receivers);
    delete params.receiver;
  }

  return params;
};

/**
 * formatRequestParams
 * @param {Object} opts
 * @return {Object}
 */
const getSplitParams = (opts: {
  qs: { appId: any; appKey: any };
  appId: any;
  appKey: any;
  headers: any;
  base: { webservice: any };
}) => {
  opts = clone(opts);

  opts.qs = {
    appId: opts.appId,
    appKey: opts.appKey,
  };

  opts.headers = {
    ...opts.headers,
    Accept: 'application/vnd.pagseguro.com.br.v3+xml',
  };

  return {
    opts,
    url: `${opts.base.webservice}/${api.split.transaction}`,
  };
};

/**
 * formatResponse
 * @param {Object} rs
 * @param {String} method
 */
const formatResponse = (rs: { method?: string } = {}, method: string) => {
  rs.method = method;
  return rs;
};

/**
 * boleto
 * @param {Object} opts
 * @param {Object} params
 * @ return {Promise}
 */
const boleto = async (opts: any, params: { method?: string } = {}) => {
  params.method = 'boleto';
  params = formatRequestParams(opts, params);

  let url = `${opts.base.webservice}/${api.transaction.directPayment}`;

  // is split
  if (params.hasOwnProperty('receivers')) {
    const split = getSplitParams(opts);
    url = split.url;
    opts = split.opts;
  }

  // console.log(params.receivers.receiver.split);

  try {
    const response = await request({
      ...opts,
      url,
      method: 'POST',
      body: opts.jsonToXml({ payment: params }),
    });

    return {
      ...response,
      content: formatResponse(response.content.transaction, 'boleto'),
    };
  } catch ({ response }) {
    // console.error(response);
    throw new PagSeguroError(response);
  }
};

/**
 * creditCard
 * @param {Object} opts
 * @param {Object} params
 * @ return {Promise}
 */
const creditCard = async (opts: any, params: { method: string }) => {
  params.method = 'creditCard';
  params = formatRequestParams(opts, params);

  let url = `${opts.base.webservice}/${api.transaction.directPayment}`;

  // is split
  if (params.hasOwnProperty('receivers')) {
    const split = getSplitParams(opts);
    url = split.url;
    opts = split.opts;
  }

  try {
    const response = await request({
      ...opts,
      url,
      method: 'POST',
      body: opts.jsonToXml({ payment: params }),
    });

    return {
      ...response,
      content: formatResponse(response.content.transaction, 'creditCard'),
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * onlineDebit
 * @param {Object} opts
 * @param {Object} params
 * @ return {Promise}
 */
const onlineDebit = async (opts: any, params: { method?: string } = {}) => {
  params.method = 'EFT';
  params = formatRequestParams(opts, params);

  let url = `${opts.base.webservice}/${api.transaction.directPayment}`;

  // is split
  if (params.hasOwnProperty('receivers')) {
    const split = getSplitParams(opts);
    url = split.url;
    opts = split.opts;
  }

  try {
    const response = await request({
      ...opts,
      url,
      method: 'POST',
      body: opts.jsonToXml({ payment: params }),
    });

    return {
      ...response,
      content: formatResponse(response.content.transaction, 'onlineDebit'),
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * cancel
 * @param {Object} opts
 * @param {String} transactionCode
 * @ return {Promise}
 */
const cancel = async (opts: any, transactionCode: any) => {
  opts.qs = {
    ...opts.qs,
    transactionCode,
  };

  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${api.transaction.cancel}`,
      method: 'POST',
    });

    return {
      ...response,
      content: `Transação ${transactionCode} cancelada com sucesso.`,
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * refund
 * @param {Object} opts
 * @param {String} transactionCode
 * @param {Number} refundValue
 * @ return {Promise}
 */
const refund = async (opts: any, transactionCode: any, refundValue = null) => {
  opts.qs = {
    ...opts.qs,
    transactionCode,
  };

  if (refundValue) {
    opts.qs.refundValue = refundValue;
  }

  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${api.transaction.refund}`,
      method: 'POST',
    });

    return {
      ...response,
      content: `Pedido de reembolso da transação  ${transactionCode} realizado com sucesso.`,
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * search
 * @param {Object} opts
 * @param {Object} query
 * @ return {Promise}
 */
const search = async (opts: any, query = {}) => {
  opts.qs = {
    ...opts.qs,
    ...query,
  };

  const responseContent = (data: { transactions: { transaction: any } }) => {
    if (!data) {
      return {
        date: new Date(
          `${new Date().toString().split('GMT')[0]} UTC`
        ).toISOString(),
        transactions: [],
        resultsInThisPage: 0,
        currentPage: 1,
        totalPages: 0,
      };
    }

    return {
      ...data,
      transactions:
        data.transactions && data.transactions.transaction
          ? data.transactions.transaction
          : [],
    };
  };

  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${api.transaction.search}`,
      method: 'GET',
    });

    return {
      ...response,
      content: responseContent(response.content.transactionSearchResult),
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * get
 * @param {Object} opts
 * @param {String} transactionCode
 * @ return {Promise}
 */
const get = async (opts: any, transactionCode: any) => {
  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${api.transaction.code}/${transactionCode}`,
      method: 'GET',
    });

    return {
      ...response,
      content: response.content.transaction || null,
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * notification
 * @param {Object} opts
 * @param notificationCode
 * @ return {Promise}
 */
const notification = async (opts: any, notificationCode: any) => {
  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${api.transaction.notification}/${notificationCode}`,
      method: 'GET',
    });

    return {
      ...response,
      content: response.content,
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

/**
 * exports
 */
export default {
  boleto,
  creditCard,
  onlineDebit,
  cancel,
  refund,
  search,
  notification,
  get,
};
