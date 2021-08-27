import { Coupon } from '../types';

export const convertAmount = (amount: number, currency: string) => {
  return ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw'].includes(currency) ? amount : amount / 100;
};

export const getHumanDiscount = (coupon: Coupon) => {
  if (coupon.amount_off && coupon.currency) {
    return getFormattedPrice({ amount: coupon.amount_off, currency: coupon.currency });
  }
  if (coupon.percent_off) {
    // TODO: Translators.
    return `${coupon.percent_off | 0}% off`;
  }
  return '';
};

export const getFormattedPrice = ({ amount, currency }: { amount: number; currency: string }) => {
  const converted = convertAmount(amount, currency);

  return `${new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
  }).format(parseFloat(converted.toFixed(2)))}`;
};

// get the currency symbol for a currency code.
export const getCurrencySymbol = (code: string = 'usd') => {
  const [currency] = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
  }).formatToParts();
  return currency?.value;
};
