import { Checkout } from '../../../../../types';
import { hasAnyRuleGroupPassed, compareNumberValues, compareObjectValues, hasRulesPassed } from '../conditional-functions';

describe('Conditional form logic', () => {
  describe('hasAnyRuleGroupPassed', () => {
    it('Test Rule groups', () => {
      let result = hasAnyRuleGroupPassed(
        [
          {
            group_id: 'asdf',
            rules: [{ condition: 'total', operator: '==', value: '10000' }],
          },
        ],
        {
          checkout: {
            total_amount: 10000,
          } as Checkout,
          processor: 'stripe',
        },
      );
      expect(result).toBe(true);
    });
  });

  describe('hasRulesPassed', () => {
    it('Order total and processor', () => {
      expect(
        hasRulesPassed(
          [
            { condition: 'total', operator: '==', value: '10000' },
            { condition: 'processors', operator: 'any', value: ['test_processor_id'] },
          ],
          {
            checkout: {
              total_amount: 10000,
            },
            processor: 'test_processor_id',
          },
        ),
      ).toBe(true);
      expect(
        hasRulesPassed(
          [
            { condition: 'total', operator: '==', value: '10000' },
            { condition: 'processors', operator: 'any', value: ['test_processor_id'] },
          ],
          {
            checkout: {
              total_amount: 10001,
            },
            processor: 'test_processor_id',
          },
        ),
      ).toBe(false);
      expect(
        hasRulesPassed(
          [
            { condition: 'total', operator: '==', value: '10000' },
            { condition: 'processors', operator: 'any', value: ['test_processor_id'] },
          ],
          {
            checkout: {
              total_amount: 10000,
            },
            processor: 'test_processor_id1',
          },
        ),
      ).toBe(false);
    });
  });

  describe('compareNumberValues', () => {
    let rule_order_value = 100;

    it('Order total is less than 100', () => {
      const rule_group = {
        condition: 'total',
        operator: '<',
        value: '100',
      };
      let result = compareNumberValues(90, parseFloat(rule_group.value), rule_group.operator);
      expect(result).toBe(true);
    });

    it('Order total is greater than 100', () => {
      let result = compareNumberValues(120, rule_order_value, '>');
      expect(result).toBe(true);
    });

    it('Order total is equal to 100', () => {
      let result = compareNumberValues(100, rule_order_value, '==');
      expect(result).toBe(true);
    });
  });

  describe('compareObjectValues', () => {
    const rule_group = {
      condition: 'products',
      operator: 'any',
      value: ['c08275a8-4a1a-4e69-a488-e508f92e9dac', '5aaf576f-6bcb-49cd-8c4c-f2ef264f03d8'],
    };

    describe('Products', () => {
      it('Cart contains any of the product', () => {
        expect(compareObjectValues(['c08275a8-4a1a-4e69-a488-e508f92e9dac'], rule_group.value, 'any')).toBe(true);
      });

      it('Cart contains all of the product', () => {
        expect(compareObjectValues(['c08275a8-4a1a-4e69-a488-e508f92e9dac', '5aaf576f-6bcb-49cd-8c4c-f2ef264f03d8'], rule_group.value, 'all')).toBe(true);
      });

      it('Cart contains none of the product', () => {
        expect(compareObjectValues(['c08275a8-4a1a-4e69-a488-e508f92e9daq'], rule_group.value, 'none')).toBe(true);
      });
    });

    describe('Coupons', () => {
      const rule_group = {
        condition: 'coupons',
        operator: 'any',
        value: ['c638aa78-5b51-4d4f-a96a-bf1a462db6c5', '93363978-1ba8-4d87-9108-68d90825b386'],
      };

      it('Cart contains any of the coupon', () => {
        expect(compareObjectValues(['c638aa78-5b51-4d4f-a96a-bf1a462db6c5'], rule_group.value, 'any')).toBe(true);
      });

      it('Cart contains all of the coupons', () => {
        expect(compareObjectValues(['c638aa78-5b51-4d4f-a96a-bf1a462db6c5', '93363978-1ba8-4d87-9108-68d90825b386'], rule_group.value, 'all')).toBe(true);
      });

      it('Cart contains none of the coupon', () => {
        expect(compareObjectValues(['c08275a8-4a1a-4e69-a488-e508f92e9daq'], rule_group.value, 'none')).toBe(true);
      });

      it('Cart - coupon exists', () => {
        expect(compareObjectValues(['c08275a8-4a1a-4e69-a488-e508f92e9daq'], rule_group.value, 'exist')).toBe(true);
        expect(compareObjectValues([], rule_group.value, 'exist')).toBe(false);
      });

      it('Cart - coupon not exist', () => {
        expect(compareObjectValues(['asdf'], rule_group.value, 'not_exist')).toBe(false);
        expect(compareObjectValues([], rule_group.value, 'not_exist')).toBe(true);
      });
    });

    describe('Shipping & Billing Country', () => {
      const rule_group = {
        condition: 'billing_country',
        operator: 'any',
        value: ['IN'],
      };

      it('Cart contains any of the country', () => {
        let result = compareObjectValues(['IN'], rule_group.value, 'any');
        expect(result).toBe(true);
      });

      it('Cart contains none of the country', () => {
        let result = compareObjectValues(['US'], rule_group.value, 'none');
        expect(result).toBe(true);
      });
    });

    describe('Payment Processor', () => {
      const rule_group = {
        condition: 'processors',
        operator: 'any',
        value: ['stripe'],
      };
      it('Selected payment for cart - any', () => {
        expect(compareObjectValues(['stripe'], rule_group.value, 'any')).toBe(true);
      });

      it('Selected payment for cart - none', () => {
        expect(compareObjectValues(['paypal'], rule_group.value, 'none')).toBe(true);
      });
    });
  });
});
