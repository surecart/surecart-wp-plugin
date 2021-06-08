import { Price } from '../types';

export const convertAmount = (amount: number, currency: string) => {
  return ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw'].includes(currency) ? amount : amount / 100;
};
export const getFormattedPrice = (price: Price) => {
  const amount = convertAmount(price.amount, price.currency);

  return `${new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: price.currency,
  }).format(parseFloat(amount.toFixed(2)))}`;
};
