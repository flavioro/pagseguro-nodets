import request from 'request-promise';
import api from '../config/api';
import PagSeguroError from '../errors/PagSeguroError';

const get = async (opts: any, { ...params }: any): Promise<any> => {
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
      url: `${opts.base.webservice}/${api.installment}`,
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
