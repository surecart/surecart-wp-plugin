import { Coupon, Price } from '../types';
import { __, _n, sprintf } from '@wordpress/i18n';

export const convertAmount = (amount: number, currency: string) => {
  return ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw'].includes(currency) ? amount : amount / 100;
};

export const getHumanDiscount = (coupon: Coupon) => {
  if (coupon.amount_off && coupon.currency) {
    return getFormattedPrice({ amount: coupon.amount_off, currency: coupon.currency });
  }
  if (coupon.percent_off) {
    // Translators: Percent off.
    return sprintf(__('%1d%% off', 'surecart'), coupon.percent_off | 0);
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
  }).formatToParts(0);
  return currency?.value;
};

export const translateInterval = (
  amount: number,
  interval: string,
  prefix: string = __('every', 'surecart'),
  fallback: string = __('once', 'surecart'),
  showSingle: boolean = false,
) => {
  switch (interval) {
    case 'day':
      return `${prefix} ${sprintf(showSingle ? _n('%d day', '%d days', amount, 'surecart') : _n('day', '%d days', amount, 'surecart'), amount)}`;
    case 'week':
      return `${prefix} ${sprintf(showSingle ? _n('%d week', '%d weeks', amount, 'surecart') : _n('week', '%d weeks', amount, 'surecart'), amount)}`;
    case 'month':
      return `${prefix} ${sprintf(showSingle ? _n('%d month', '%d months', amount, 'surecart') : _n('month', '%d months', amount, 'surecart'), amount)}`;
    case 'year':
      return `${prefix} ${sprintf(showSingle ? _n('%d year', '%d years', amount, 'surecart') : _n('year', '%d years', amount, 'surecart'), amount)}`;
    default:
      return fallback;
  }
};

interface IntervalOptions {
  showOnce?: boolean;
  labels?: {
    interval?: string;
    period?: string;
  };
}
export const intervalString = (price: Price, options: IntervalOptions = {}) => {
  if (!price) {
    return '';
  }
  const { showOnce, labels } = options;
  const { interval = __('every', 'surecart'), period = __('for', 'surecart') } = labels || {};
  return `${intervalCountString(price, interval, !!showOnce ? __('once', 'surecart') : '')} ${periodCountString(price, period)}`;
};

export const intervalCountString = (price: Price, prefix, fallback = __('once', 'surecart')) => {
  if (!price.recurring_interval_count || !price.recurring_interval) {
    return '';
  }
  return translateInterval(price.recurring_interval_count, price.recurring_interval, ` ${prefix}`, fallback);
};

export const periodCountString = (price: Price, prefix, fallback = '') => {
  if (!price?.recurring_period_count || !price?.recurring_interval) {
    return '';
  }
  return translateInterval((price?.recurring_period_count || 0) * price?.recurring_interval_count, price?.recurring_interval, ` ${prefix}`, fallback, true);
};
