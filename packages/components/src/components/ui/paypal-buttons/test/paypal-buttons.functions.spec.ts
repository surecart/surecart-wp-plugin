import { getScriptLoadParams } from '../functions';

describe('Paypal Buttons Functions', () => {
  describe('getScriptLoadParams', () => {
    it('loads a recurring dataset', () => {
      expect(
        getScriptLoadParams({
          clientId: 'client_id',
          reusable: true,
          merchantId: 'merchant_id',
          currency: 'eur',
        }),
      ).toEqual({
        'client-id': 'client_id',
        'commit': false,
        'intent': 'tokenize',
        'vault': true,
        'currency': 'EUR',
      });
    });
  });
});
