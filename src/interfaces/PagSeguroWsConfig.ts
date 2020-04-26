export interface PagSeguroWsConfig {
  base: {
    production: string;
    sandbox: string;
  };
  static: {
    production: string;
    sandbox: string;
  };
  webservice: {
    production: string;
    sandbox: string;
  };
  session: string;
  transaction: {
    search: string;
    directPayment: string;
    code: string;
    refund: string;
    cancel: string;
    notification: string;
  };
  split: {
    transaction: string;
  };

  // -- working! --
  authorization: {
    request: string;
    response: string;
    search: string;
    notification: string;
  };
  notification: {
    preApproval: string;
  };
  payment: {
    request: string;
    response: string;
  };
  installment: string;
  preApproval: {
    request: string;
    response: string;
    cancel: string;
    charge: string;
    search: string;
  };
  directPreApproval: {
    request: string;
    accession: string;
    plan: string;
    query: string;
    payment: string;
    status: string;
    cancel: string;
    discount: string;
    changePayment: string;
    queryPaymentORder: string;
    queryNotification: string;
    retryPaymentOrder: string;
  };
}
