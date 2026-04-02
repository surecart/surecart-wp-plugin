import { getScriptLoadParams } from '../functions';

describe('Paypal Buttons Functions', () => {
  describe('getScriptLoadParams', () => {
    it('should not use merchant_id for CIB subscriptions', () => {
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: true, // it's a subscription
          merchantId: 'merchant_id',
          currency: 'eur',
          merchantInitiated: false, // CIB
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'tokenize',
        'vault': true,
        'currency': 'EUR',
        'locale': 'en_US',
      });
    });

    it('should use merchant_id for MIB subscriptions', () => {
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: true, // subscription
          merchantId: 'merchant_id',
          currency: 'eur',
          merchantInitiated: true, // MIB
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'tokenize',
        'merchant-id': 'merchant_id',
        'vault': true,
        'currency': 'EUR',
        'locale': 'en_US',
      });
    });

    it('should include locale in params with underscore format when provided', () => {
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: false,
          merchantId: 'merchant_id',
          currency: 'eur',
          merchantInitiated: false,
          locale: 'de-DE',
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'capture',
        'vault': true,
        'merchant-id': 'merchant_id',
        'currency': 'EUR',
        'locale': 'de_DE',
      });
    });

    it('should default locale to en_US when not provided', () => {
      const params = getScriptLoadParams({
        clientId: 'client_id',
        reusable: false,
        merchantId: 'merchant_id',
        currency: 'eur',
        merchantInitiated: false,
      });
      expect(params.locale).toBe('en_US');
    });

    it('should use a merchant_id for a non-subscription order (regardless of CIB/MIB)', () => {
      // MIB off.
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: false,
          merchantId: 'merchant_id',
          currency: 'eur',
          merchantInitiated: false,
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'capture',
        'vault': true,
        'merchant-id': 'merchant_id',
        'currency': 'EUR',
        'locale': 'en_US',
      });

      // MIB on.
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: false,
          merchantId: 'merchant_id',
          currency: 'eur',
          merchantInitiated: true,
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'capture',
        'vault': true,
        'merchant-id': 'merchant_id',
        'currency': 'EUR',
        'locale': 'en_US',
      });
    });
  });
});
