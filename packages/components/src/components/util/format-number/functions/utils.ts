export const maybeConvertAmount = (amount: number, currency: string) => {
  return isZeroDecimal(currency) ? amount : amount / 100;
};

export const isZeroDecimal = (currency: string) => {
  return [ 'bif', 'byr', 'clp', 'djf', 'gnf', 'huf', 'isk', 'jpy', 'kmf', 'krw', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xag', 'xau', 'xba', 'xbb', 'xbc', 'xbd', 'xdr', 'xof', 'xpd', 'xpf', 'xpt', 'xts' ].includes(currency?.toLowerCase?.());
};
