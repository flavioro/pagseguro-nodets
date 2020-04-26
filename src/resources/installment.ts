import request from 'request-promise';
import config from '../config';
import PagSeguroError from '../errors';

const get = async (opts: any, { ...params }: any): any => {
  if (params.amount && params.amount.toFixed) {
    params.amount = params.amount.toFixed(2);
  }

  opts.qs = {
    ...opts.qs,
    ...params,
  };

  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${config.installment}`,
      method: 'GET',
    });

    return {
      ...response,
      content: response.content
        ? response.content.installments.installment
        : [],
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

export default {
  get,
};
