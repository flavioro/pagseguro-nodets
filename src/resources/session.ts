import request from 'request-promise';
import config from '../config';
import PagSeguroError from '../errors/PagSeguroError';

const get = async (opts: any): Promise<any> => {
  console.log(opts);
  try {
    const response = await request({
      ...opts,
      url: `${opts.base.webservice}/${config.session}`,
      method: 'POST',
    });

    return {
      ...response,
      content: response.content.session.id,
    };
  } catch (e) {
    const error = { ...e.response };

    if (error.content && error.content === 'Unauthorized') {
      error.content = [
        {
          code: 401,
          message: 'Unauthorized',
        },
      ];
    }

    throw new PagSeguroError(error);
  }
};

export default {
  get,
};
