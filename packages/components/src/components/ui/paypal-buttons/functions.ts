export const getScriptLoadParams = ({ clientId, reusable, merchantId, currency }) => {
  return {
    'client-id': clientId.replace(/ /g, ''),
    ...(!reusable ? { 'merchant-id': merchantId.replace(/ /g, '') } : {}),
    'commit': false,
    'intent': reusable ? 'tokenize' : 'capture',
    'vault': true,
    'currency': currency ? currency.toUpperCase() : 'USD',
  };
};
