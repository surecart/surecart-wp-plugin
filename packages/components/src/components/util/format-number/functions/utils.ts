export const maybeConvertAmount = (amount: number, currency: string) => {
  return isZeroDecimal(currency) ? amount : amount / 100;
};

export const isZeroDecimal = (currency: string) => {
  return ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw'].includes(currency.toLowerCase());
};
