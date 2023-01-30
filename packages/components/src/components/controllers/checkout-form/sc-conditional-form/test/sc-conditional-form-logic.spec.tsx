import * as logic from '../conditional-functions';

describe('Conditional form logic', () => {
  describe('is_any_rule_group_passed', () => {
    it('Test Rule groups', () => {
      let result = logic.is_any_rule_group_passed(
        [
          {
            rules: [{ condition: 'total', operator: '==', value: '10000' }],
          },
        ],
        {
          checkout: {
            total_amount: 10000,
          },
          processor: 'stripe',
        },
      );
      expect(result).toBe(true);
    });
  });

  describe('compare_number_values', () => {
    let rule_order_value = 100;

    it('Order total is less than 100', () => {
      const rule_group = {
        condition: 'total',
        operator: '<',
        value: '100',
      };
      let result = logic.compare_number_values(90, rule_group.value, rule_group.operator);
      expect(result).toBe(true);
    });

    it('Order total is greater than 100', () => {
      let result = logic.compare_number_values(120, rule_order_value, '>');
      expect(result).toBe(true);
    });

    it('Order total is equal to 100', () => {
      let result = logic.compare_number_values(100, rule_order_value, '==');
      expect(result).toBe(true);
    });
  });

  describe('compare_object_values', () => {
    const rule_group = {
      condition: 'products',
      operator: 'any',
      value: [
        {
          label: 'OT 100',
          value: 'c08275a8-4a1a-4e69-a488-e508f92e9dac',
        },
        {
          label: 'OT 50',
          value: '5aaf576f-6bcb-49cd-8c4c-f2ef264f03d8',
        },
      ],
    };

    describe('Products', () => {
      it('Cart contains any of the product', () => {
        let cart_products = [
          {
            label: 'OT 100',
            value: 'c08275a8-4a1a-4e69-a488-e508f92e9dac',
          },
        ];
        let result = logic.compare_object_values(cart_products, rule_group.value, 'any');
        expect(result).toBe(true);
      });

      it('Cart contains all of the product', () => {
        let cart_products = [
          {
            label: 'OT 100',
            value: 'c08275a8-4a1a-4e69-a488-e508f92e9dac',
          },
          {
            label: 'OT 50',
            value: '5aaf576f-6bcb-49cd-8c4c-f2ef264f03d8',
          },
        ];
        let result = logic.compare_object_values(cart_products, rule_group.value, 'all');
        expect(result).toBe(true);
      });

      it('Cart contains none of the product', () => {
        let cart_products = [
          {
            label: 'OT 100',
            value: 'c08275a8-4a1a-4e69-a488-e508f92e9daq',
          },
        ];
        let result = logic.compare_object_values(cart_products, rule_group.value, 'none');
        expect(result).toBe(true);
      });
    });

    describe('Coupons', () => {
      const rule_group = {
        condition: 'coupons',
        operator: 'any',
        value: [
          {
            label: '100off',
            value: 'c638aa78-5b51-4d4f-a96a-bf1a462db6c5',
          },
          {
            label: '50off',
            value: '93363978-1ba8-4d87-9108-68d90825b386',
          },
        ],
      };

      it('Cart contains any of the coupon', () => {
        let cart_coupons = [
          {
            label: '100off',
            value: 'c638aa78-5b51-4d4f-a96a-bf1a462db6c5',
          },
        ];
        let result = logic.compare_object_values(cart_coupons, rule_group.value, 'any');
        expect(result).toBe(true);
      });

      it('Cart contains all of the coupons', () => {
        let cart_coupons = [
          {
            label: '100off',
            value: 'c638aa78-5b51-4d4f-a96a-bf1a462db6c5',
          },
          {
            label: '50off',
            value: '93363978-1ba8-4d87-9108-68d90825b386',
          },
        ];

        let result = logic.compare_object_values(cart_coupons, rule_group.value, 'all');
        expect(result).toBe(true);
      });

      it('Cart contains none of the coupon', () => {
        let cart_coupons = [
          {
            label: 'OT 100',
            value: 'c08275a8-4a1a-4e69-a488-e508f92e9daq',
          },
        ];
        let result = logic.compare_object_values(cart_coupons, rule_group.value, 'none');
        expect(result).toBe(true);
      });

      it('Cart - coupon exists', () => {
        let cart_coupons = [
          {
            label: 'OT 100',
            value: 'c08275a8-4a1a-4e69-a488-e508f92e9daq',
          },
        ];
        let result = logic.compare_object_values(cart_coupons, rule_group.value, 'exist');
        expect(result).toBe(true);
      });

      it('Cart - coupon not exist', () => {
        let cart_coupons = [];
        let result = logic.compare_object_values(cart_coupons, rule_group.value, 'not_exist');
        expect(result).toBe(true);
      });
    });

    describe('Shipping & Billing Country', () => {
      const rule_group = {
        condition: 'billing_country',
        operator: 'any',
        value: [
          {
            label: 'India',
            value: 'IN',
          },
        ],
      };

      it('Cart contains any of the country', () => {
        let cart_data = [
          {
            label: 'India',
            value: 'IN',
          },
        ];
        let result = logic.compare_object_values(cart_data, rule_group.value, 'any');
        expect(result).toBe(true);
      });

      it('Cart contains none of the country', () => {
        let cart_data = [
          {
            label: 'US',
            value: 'US',
          },
        ];
        let result = logic.compare_object_values(cart_data, rule_group.value, 'none');
        expect(result).toBe(true);
      });
    });

    describe('Payment Processor', () => {
      const rule_group = {
        condition: 'processors',
        operator: 'any',
        value: [
          {
            label: 'Stripe',
            value: 'stripe',
          },
        ],
      };
      it('Selected payment for cart - any', () => {
        let cart_data = [
          {
            label: 'Stripe',
            value: 'stripe',
          },
        ];
        let result = logic.compare_object_values(cart_data, rule_group.value, 'any');
        expect(result).toBe(true);
      });

      it('Selected payment for cart - none', () => {
        let cart_data = [
          {
            label: 'PayPal',
            value: 'paypal',
          },
        ];
        let result = logic.compare_object_values(cart_data, rule_group.value, 'none');
        expect(result).toBe(true);
      });
    });
  });
});
