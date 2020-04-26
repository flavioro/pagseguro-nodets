import clone from 'clone';
import ip from 'ip';
import validate from './helper/validate';

/**
 * sender
 * @param {Object} sender
 * @return {Object}
 */
function sender(sender: {
  document: any;
  documents: { document: any };
  ip: string;
}): any {
  if (!validate.isObject(sender)) {
    return {};
  }

  sender = clone(sender);

  if (sender.document) {
    sender.documents = {
      document: sender.document || {},
    };
    delete sender.document;
  }

  sender.ip = ip.address();

  return sender;
}

/**
 * creditCard
 * @param {Object} creditCard
 * @param {Object} params
 * @return {Object}
 */
function creditCard(
  creditCard: {
    holder: { documents: { document: any }; document: any };
    installment: {
      quantity?: any;
      value?: any;
      noInterestInstallmentQuantity?: any;
      installmentAmount?: any;
    };
    maxInstallmentNoInterest: number;
    billingAddress: {};
  },
  params: { billing?: {} } = {}
) {
  if (!validate.isObject(creditCard)) {
    return {};
  }

  creditCard = clone(creditCard);

  if (creditCard.holder && validate.isObject(creditCard.holder)) {
    creditCard.holder.documents = {
      document: creditCard.holder.document || {},
    };

    if (creditCard.holder.document) delete creditCard.holder.document;
  }

  if (creditCard.installment) {
    const { installmentAmount } = creditCard.installment;

    creditCard.installment = {
      quantity: creditCard.installment.quantity,
    };

    if (installmentAmount) {
      creditCard.installment.value = Number(installmentAmount).toFixed(2);
    }

    if (
      creditCard.maxInstallmentNoInterest &&
      creditCard.maxInstallmentNoInterest > 1
    ) {
      creditCard.installment.noInterestInstallmentQuantity =
        creditCard.maxInstallmentNoInterest;
    }
  }

  if (params.billing) {
    creditCard.billingAddress = params.billing || {};
  } else {
    creditCard.billingAddress = {};
  }

  return creditCard;
}

/**
 * billing
 * @param {Object} billing
 * @return {Object}
 */
function billing(billing: { addressRequired?: boolean }) {
  billing = clone(billing);

  if (!validate.isObject(billing)) {
    return { addressRequired: false };
  }

  if (
    billing.hasOwnProperty('addressRequired') &&
    billing.addressRequired == false
  ) {
    return { addressRequired: false };
  }

  if (Object.keys(billing).length == 0) {
    return { addressRequired: false };
  }

  return { address: billing };
}

/**
 * shipping
 * @param {Object} shipping
 * @return {Object}
 */
function shipping(shipping: { addressRequired?: any; type?: any; cost?: any }) {
  if (!validate.isObject(shipping)) {
    return { addressRequired: false };
  }

  shipping = clone(shipping);

  if (
    shipping.hasOwnProperty('addressRequired') &&
    shipping.addressRequired == false
  ) {
    return { addressRequired: false };
  }

  if (Object.keys(shipping).length == 0) {
    return { addressRequired: false };
  }

  const newShipping: {
    addressRequired?: any;
    type?: any;
    cost?: string;
    address: any;
  } = { address: shipping };

  if (shipping.type) {
    newShipping.type = shipping.type;
  }

  if (shipping.cost) {
    newShipping.cost = Number(shipping.cost).toFixed(2);
  }

  return newShipping;
}

/**
 * extraAmount
 * @param {Number} extraAmount
 * @return {Object}
 */
function extraAmount(extraAmount: string) {
  if (extraAmount) {
    extraAmount = Number(extraAmount).toFixed(2);
  }

  return extraAmount;
}

/**
 * items
 * @param {Array} items
 * @return {Object}
 */
function items(items: any[]) {
  if (!validate.isArray(items)) {
    return { item: [] };
  }

  items = clone(items);

  return {
    item: items.map(item => {
      if (item.amount) {
        item.amount = Number(item.amount).toFixed(2);
      }
      return item;
    }),
  };
}

/**
 * receivers
 * @param {Array} receivers
 * @return {Object}
 */
function receivers(receivers: any[]) {
  if (!validate.isArray(receivers)) {
    return { receiver: [] };
  }

  receivers = clone(receivers);

  return {
    receiver: receivers.map(receiver => {
      if (receiver.split.amount) {
        receiver.split.amount = Number(receiver.split.amount).toFixed(2);
      }

      if (receiver.split.ratePercent) {
        receiver.split.ratePercent = Number(receiver.split.ratePercent).toFixed(
          2
        );
      }

      if (receiver.split.feePercent) {
        receiver.split.feePercent = Number(receiver.split.feePercent).toFixed(
          2
        );
      }

      return receiver;
    }),
  };
}

/**
 * permissions
 * @param {Array} permissions
 * @return {Object}
 */
function permissions(permissions: any) {
  if (!validate.isArray(permissions)) {
    return { code: permissions };
  }

  return {
    code: permissions,
  };
}

/**
 * person
 * @param {Object} person
 * @return {Object}
 */
function person(person: any) {
  if (!validate.isObject(person)) {
    return {};
  }

  person = clone(person);

  return person;
}

/**
 * company
 * @param {Object} company
 * @return {Object}
 */
function company(company: any) {
  if (!validate.isObject(company)) {
    return {};
  }

  company = clone(company);

  return company;
}

/**
 * account
 * @param {Object} account
 * @return {Object}
 */
function account(account?: { type: string }) {
  if (!validate.isObject(account)) {
    return {};
  }

  switch (account?.type) {
    case 'PERSON':
      return person(account);
    case 'COMPANY':
      return company(account);
    default:
      return {};
  }
}

/**
 * exports
 */
export default {
  sender,
  creditCard,
  shipping,
  billing,
  items,
  extraAmount,
  permissions,
  account,
  receivers,
};
