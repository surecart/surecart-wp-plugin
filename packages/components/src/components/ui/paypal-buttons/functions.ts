export const getScriptLoadParams = ({ clientId, reusable, merchantId, currency = 'usd', merchantInitiated, locale = 'en-US' }) => {
  return {
    'client-id': clientId.replace(/ /g, ''),
    ...(!reusable || merchantInitiated ? { 'merchant-id': merchantId.replace(/ /g, '') } : {}),
    locale: (locale ?? 'en-US').replace(/-/g, '_'),
    'commit': false,
    'intent': reusable ? 'tokenize' : 'capture',
    'vault': true,
    'currency': currency ? currency.toUpperCase() : 'USD',
  };
};
