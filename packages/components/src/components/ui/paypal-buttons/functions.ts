export const getScriptLoadParams = ({ clientId, reusable, merchantId, currency, merchantInitiated }) => {
  return {
    'client-id': clientId.replace(/ /g, ''),
    ...(!reusable || merchantInitiated ? { 'merchant-id': merchantId.replace(/ /g, '') } : {}),
    'commit': false,
    'intent': reusable ? 'tokenize' : 'capture',
    'vault': true,
    'currency': currency ? currency.toUpperCase() : 'USD',
  };
};
