import clone from 'clone';
import pagseguro from '../src';

describe('Format', () => {
  /**
   * sender
   */
  describe('sender', () => {
    it('insert into document in documents', () => {
      const formatted = pagseguro.format.sender(
        pagseguro.testConfig.payment.sender
      );
      expect(formatted.documents.document).toEqual(
        pagseguro.testConfig.payment.sender.document
      );
    });
  });

  /**
   * CreditCard
   */
  describe('creditCard', () => {
    const formatted = pagseguro.format.creditCard(
      pagseguro.testConfig.payment.creditCard,
      pagseguro.testConfig.payment
    );

    it('return formatted object', () => {
      expect(Object.keys(formatted).sort()).toEqual([
        'billingAddress',
        'holder',
        'installment',
        'maxInstallmentNoInterest',
        'token',
      ]);
      expect(Object.keys(formatted.holder).sort()).toEqual([
        'birthDate',
        'documents',
        'email',
        'name',
        'phone',
      ]);
      expect(Object.keys(formatted.installment).sort()).toEqual([
        'quantity',
        'value',
      ]);
    });

    it('insert into document in documents', () => {
      expect(formatted.holder.documents.document).toEqual(
        pagseguro.testConfig.payment.creditCard.holder.document
      );
    });

    it('total amount formatted to 00.00', () => {
      expect(formatted.installment.value).toEqual(
        pagseguro.testConfig.payment.creditCard.installment.totalAmount.toFixed(
          2
        )
      );
    });

    it('set billing address', () => {
      const configPayment = clone(pagseguro.testConfig.payment);
      let _formatted = pagseguro.format.creditCard(
        configPayment.creditCard,
        configPayment
      );

      configPayment.billing = {addressRequired: false};
      _formatted = pagseguro.format.creditCard(
        configPayment.creditCard,
        configPayment
      );
      expect(_formatted.billingAddress).toHaveProperty(
        'addressRequired',
        false
      );

      delete configPayment.billing;
      _formatted = pagseguro.format.creditCard(
        configPayment.creditCard,
        configPayment
      );
      expect(_formatted.billingAddress).toEqual({});
    });
  });

  /**
   * billing
   */
  describe('billing', () => {
    it('set addressRequired to false if empty object', () => {
      const formatted = pagseguro.format.billing({});
      expect(formatted).toHaveProperty('addressRequired', false);
    });

    it('set addressRequired to false if parameter is not object', () => {
      const formatted = pagseguro.format.billing();
      expect(formatted).toHaveProperty('addressRequired', false);
    });

    it('if success return an equal object', () => {
      const formatted = pagseguro.format.billing(
        pagseguro.testConfig.payment.billing
      );
      expect(formatted.address).toEqual(pagseguro.testConfig.payment.billing);
    });
  });

  /**
   * shipping
   */
  describe('shipping', () => {
    it('set addressRequired to false if empty object', () => {
      const formatted = pagseguro.format.shipping({});
      expect(formatted).toHaveProperty('addressRequired', false);
    });

    it('set addressRequired to false if parameter is not object', () => {
      const formatted = pagseguro.format.shipping();
      expect(formatted).toHaveProperty('addressRequired', false);
    });

    it('if success return an equal object', () => {
      const formatted = pagseguro.format.shipping(
        pagseguro.testConfig.payment.shipping
      );
      expect(formatted.address).toEqual(pagseguro.testConfig.payment.shipping);
    });

    it('cost formatted to 00.00', () => {
      const formatted = pagseguro.format.shipping(
        pagseguro.testConfig.payment.shipping
      );
      expect(formatted.cost).toEqual(
        pagseguro.testConfig.payment.shipping.cost.toFixed(2)
      );
    });
  });

  /**
   * items
   */
  describe('items', () => {
    it('return item with empty array if parameter is not array', () => {
      const formatted = pagseguro.format.items();
      expect(formatted.item).toEqual([]);
    });

    it('return formatted object with array', () => {
      const formatted = pagseguro.format.items(
        pagseguro.testConfig.payment.items
      );
      expect(formatted).toHaveProperty('item');
      expect(Array.isArray(formatted.item)).toEqual(true);
    });

    it('format item amount to 00.00', () => {
      const formatted = pagseguro.format.items(
        pagseguro.testConfig.payment.items
      );
      expect(formatted.item[0].amount).toEqual(
        pagseguro.testConfig.payment.items[0].amount.toFixed(2)
      );
    });
  });
});
