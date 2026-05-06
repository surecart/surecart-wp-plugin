export const getScriptLoadParams = ({ clientId, reusable, merchantId, currency = 'usd', merchantInitiated, locale = '' }) => {
  const hasValidLocale = typeof locale === 'string' && locale.includes('-');
  return {
    'client-id': clientId.replace(/ /g, ''),
    ...(!reusable || merchantInitiated ? { 'merchant-id': merchantId.replace(/ /g, '') } : {}),
    ...(hasValidLocale ? { locale: locale.replace(/-/g, '_') } : {}),
    'commit': false,
    'intent': reusable ? 'tokenize' : 'capture',
    'vault': true,
    'currency': currency ? currency.toUpperCase() : 'USD',
  };
};
