import requestModule from 'request-promise';
import config from '../config';
import format from '../format';
import PagSeguroError from '../errors';

const PERMISSIONS = [
  'CREATE_CHECKOUTS',
  'SEARCH_TRANSACTIONS',
  'RECEIVE_TRANSACTION_NOTIFICATIONS',
  'MANAGE_PAYMENT_PRE_APPROVALS',
  'DIRECT_PAYMENT',
];

const request = async (
  opts: any,
  params: {
    notificationURL?: any;
    redirecURL?: any;
    permissions?: any;
    account?: { type: string };
  } = {}
) => {
  const query = {
    appId: opts.appId,
    appKey: opts.appKey,
  };

  const body = {
    notificationURL: params.notificationURL || opts.notificationURL,
    redirectURL: params.redirecURL || opts.redirectURL,
    permissions: format.permissions(params.permissions || PERMISSIONS),
    account: format.account(params.account),
  };

  try {
    const response = await requestModule({
      ...opts,
      url: `${opts.base.webservice}/${config.authorization.request}?appId=${query.appId}&appKey=${query.appKey}`,
      method: 'POST',
      body: opts.jsonToXml({ authorizationRequest: body }),
    });

    const { code } = response.content.authorizationRequest;

    return {
      ...response,
      content: {
        code,
        link: `${opts.base.base}/${config.authorization.response}?code=${code}`,
      },
    };
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

const notification = async (
  opts: { appId: any; appKey: any; transform: any; base: { webservice: any } },
  notificationCode: any
) => {
  try {
    const query = {
      appId: opts.appId,
      appKey: opts.appKey,
    };

    const response = await requestModule({
      transform: opts.transform,
      url: `${opts.base.webservice}/${config.authorization.notification}/${notificationCode}?appId=${query.appId}&appKey=${query.appKey}`,
      method: 'GET',
    });

    return response.content.authorization;
  } catch ({ response }) {
    throw new PagSeguroError(response);
  }
};

export default {
  request,
  notification,
};
