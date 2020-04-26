import requestPromise from 'request-promise';
import { Response } from 'request';
import PagSeguroError from '../errors/PagSeguroError';
import { PagSeguroRequestOptions } from '../interfaces/PagSeguroRequestOptions';
import { jsonToXml } from '../helper/utils';
import { PagSeguroPermission } from '../interfaces/PagSeguroPermission';

const PERMISSIONS: PagSeguroPermission[] = [
  { code: 'CREATE_CHECKOUTS' },
  { code: 'SEARCH_TRANSACTIONS' },
  { code: 'RECEIVE_TRANSACTION_NOTIFICATIONS' },
  { code: 'MANAGE_PAYMENT_PRE_APPROVALS' },
  { code: 'DIRECT_PAYMENT' },
];

interface AuthorizationRequest {
  notificationURL?: string;
  redirecURL?: string;
  permissions?: PagSeguroPermission[];
}

interface AuthorizationResponse extends Response {
  code: string;
  date: Date;
  link: string;
}

interface NotificationRequest {
  notificationCode: string;
}

interface NotificationResponse extends Response {
  authorization: {
    code: string;
    creationDate: Date;
  };
  account: {
    publicKey: string;
  };
  permissions: {
    permission: {
      code: string;
      status: string;
      lastUpdate: Date;
    };
  }[];
}

/**
 * Este serviço é utilizado em:
 * MODELO DE APLICAÇÕES;
 * SPLIT DE PAGAMENTO;
 */
export default class AuthorizationService {
  private readonly opts: PagSeguroRequestOptions;

  constructor(opts: PagSeguroRequestOptions) {
    this.opts = opts;
  }

  async request({
    notificationURL,
    redirecURL,
    permissions,
  }: AuthorizationRequest): Promise<AuthorizationResponse> {
    const body = {
      notificationURL: notificationURL || this.opts.config.notificationURL,
      redirectURL: redirecURL || this.opts.config.redirectURL,
      permissions: permissions || PERMISSIONS,
    };

    try {
      const response = await requestPromise({
        qs: {
          appId: this.opts.config.appId,
          appKey: this.opts.config.appKey,
        },
        headers: {
          'Content-Type': 'application/xml;charset=ISO-8859-1',
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v2/authorizations/request`,
        method: 'POST',
        body: jsonToXml({ authorizationRequest: body }),
      });

      const { code, date } = response.content.authorizationRequest;

      return {
        ...response,
        code,
        date,
        link: `${this.opts.api.base}/v2/authorization/request.jhtml?code=${code}`,
      };
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }

  async notification({
    notificationCode,
  }: NotificationRequest): Promise<NotificationResponse> {
    try {
      const response = await requestPromise({
        qs: {
          appId: this.opts.config.appId,
          appKey: this.opts.config.appKey,
        },
        transform: this.opts.transform,
        url: `${this.opts.api.webservice}/v2/authorizations/notifications/${notificationCode}`,
        method: 'GET',
      });

      return response.content;
    } catch ({ response }) {
      throw new PagSeguroError(response);
    }
  }
}
