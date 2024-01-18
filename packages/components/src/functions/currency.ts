export const zeroDecimalCurrencies = [
  'bif',
  'byr',
  'clp',
  'djf',
  'gnf',
  'isk',
  'jpy',
  'kmf',
  'krw',
  'pyg',
  'rwf',
  'ugx',
  'vnd',
  'vuv',
  'xaf',
  'xag',
  'xau',
  'xba',
  'xbb',
  'xbc',
  'xbd',
  'xdr',
  'xof',
  'xpd',
  'xpf',
  'xpt',
  'xts',
];

export const maybeConvertAmount = (amount: number, currency: string) => {
  return isZeroDecimal(currency) ? amount : amount / 100;
};

export const isZeroDecimal = (currency: string) => {
  return zeroDecimalCurrencies.includes(currency?.toLowerCase?.());
};
