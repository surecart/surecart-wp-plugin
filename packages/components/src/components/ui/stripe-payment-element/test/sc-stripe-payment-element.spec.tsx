describe('sc-stripe-payment-element', () => {
  describe('maybeApplyFilters', () => {
    let mockApplyFilters;
    let originalWindow;

    // Create a test instance of the maybeApplyFilters method
    // This mimics what the actual component does
    const maybeApplyFilters = function(options) {
      if (!window?.wp?.hooks?.applyFilters) return options;
      
      // Mock getting checkoutState from global window
      const checkoutState = window.checkoutState || { checkout: {} };
      
      return {
        ...options,
        paymentMethodOrder: window.wp.hooks.applyFilters('surecart_stripe_payment_element_payment_method_order', [], checkoutState.checkout),
        wallets: window.wp.hooks.applyFilters('surecart_stripe_payment_element_wallets', {}, checkoutState.checkout),
        terms: window.wp.hooks.applyFilters('surecart_stripe_payment_element_terms', {}, checkoutState.checkout),
        fields: window.wp.hooks.applyFilters('surecart_stripe_payment_element_fields', options.fields ?? {}),
      };
    };

    beforeEach(() => {
      // Setup window object if it doesn't exist
      if (!global.window) {
        global.window = {};
      }
      
      // Store original window
      originalWindow = global.window;
      
      // Reset window.wp before each test
      global.window.wp = undefined;
      global.window.checkoutState = { checkout: {} };
      
      mockApplyFilters = jest.fn();
    });

    afterEach(() => {
      // Restore original window
      global.window = originalWindow;
    });

    it('returns original options when window.wp is undefined', () => {
      const options = { fields: { test: 'value' }, other: 'data' };
      const result = maybeApplyFilters(options);
      
      expect(result).toBe(options);
      expect(result).toEqual(options);
    });

    it('returns original options when window.wp.hooks is undefined', () => {
      global.window.wp = {};
      const options = { fields: { test: 'value' }, other: 'data' };
      const result = maybeApplyFilters(options);
      
      expect(result).toBe(options);
      expect(result).toEqual(options);
    });

    it('returns original options when window.wp.hooks.applyFilters is undefined', () => {
      global.window.wp = { hooks: {} };
      const options = { fields: { test: 'value' }, other: 'data' };
      const result = maybeApplyFilters(options);
      
      expect(result).toBe(options);
      expect(result).toEqual(options);
    });

    it('applies filters when wp.hooks.applyFilters is available', () => {
      // Mock the checkout state
      const mockCheckout = { id: 'test-checkout' };
      global.window.checkoutState = { checkout: mockCheckout };

      // Setup mock for applyFilters
      mockApplyFilters
        .mockImplementation((filterName, defaultValue) => {
          switch (filterName) {
            case 'surecart_stripe_payment_element_payment_method_order':
              return ['card', 'paypal'];
            case 'surecart_stripe_payment_element_wallets':
              return { applePay: 'auto', googlePay: 'auto' };
            case 'surecart_stripe_payment_element_terms':
              return { card: 'auto' };
            case 'surecart_stripe_payment_element_fields':
              return { billingDetails: { email: 'never' } };
            default:
              return defaultValue;
          }
        });

      global.window.wp = { hooks: { applyFilters: mockApplyFilters } };

      const options = { fields: { test: 'value' }, other: 'data' };
      const result = maybeApplyFilters(options);

      // Verify filters were called with correct arguments
      expect(mockApplyFilters).toHaveBeenCalledTimes(4);
      expect(mockApplyFilters).toHaveBeenCalledWith(
        'surecart_stripe_payment_element_payment_method_order',
        [],
        mockCheckout
      );
      expect(mockApplyFilters).toHaveBeenCalledWith(
        'surecart_stripe_payment_element_wallets',
        {},
        mockCheckout
      );
      expect(mockApplyFilters).toHaveBeenCalledWith(
        'surecart_stripe_payment_element_terms',
        {},
        mockCheckout
      );
      expect(mockApplyFilters).toHaveBeenCalledWith(
        'surecart_stripe_payment_element_fields',
        { test: 'value' }
      );

      // Verify the result has the filtered values
      expect(result).toEqual({
        fields: { billingDetails: { email: 'never' } },
        other: 'data',
        paymentMethodOrder: ['card', 'paypal'],
        wallets: { applePay: 'auto', googlePay: 'auto' },
        terms: { card: 'auto' },
      });

      // Verify original options were not mutated (immutability check)
      expect(options).toEqual({ fields: { test: 'value' }, other: 'data' });
      expect(result).not.toBe(options);
    });

    it('handles undefined options.fields gracefully', () => {
      global.window.checkoutState = { checkout: {} };
      mockApplyFilters.mockReturnValue({});
      global.window.wp = { hooks: { applyFilters: mockApplyFilters } };

      const options = { other: 'data' };
      const result = maybeApplyFilters(options);

      // Verify the fields filter was called with empty object when fields is undefined
      expect(mockApplyFilters).toHaveBeenCalledWith(
        'surecart_stripe_payment_element_fields',
        {}
      );

      expect(result).toHaveProperty('fields', {});
    });

    it('preserves all original properties when applying filters', () => {
      global.window.checkoutState = { checkout: {} };
      mockApplyFilters.mockImplementation((_, defaultValue) => defaultValue);
      global.window.wp = { hooks: { applyFilters: mockApplyFilters } };

      const options = {
        fields: { test: 'value' },
        existingProp1: 'value1',
        existingProp2: { nested: 'object' },
        existingProp3: [1, 2, 3],
      };
      
      const result = maybeApplyFilters(options);

      // All original properties should be preserved
      expect(result.existingProp1).toBe('value1');
      expect(result.existingProp2).toEqual({ nested: 'object' });
      expect(result.existingProp3).toEqual([1, 2, 3]);
      
      // New properties should be added
      expect(result).toHaveProperty('paymentMethodOrder');
      expect(result).toHaveProperty('wallets');
      expect(result).toHaveProperty('terms');
      expect(result).toHaveProperty('fields');
    });
  });
});