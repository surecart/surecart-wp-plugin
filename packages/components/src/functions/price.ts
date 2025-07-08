import { __, _n, sprintf } from '@wordpress/i18n';

import { Coupon } from '../types';
import { zeroDecimalCurrencies } from './currency';

type recurringPriceDetails = { recurring_interval_count?: number; recurring_interval?: 'week' | 'month' | 'year' | 'never'; recurring_period_count: number };

export const convertAmount = (amount: number, currency: string) => {
  return zeroDecimalCurrencies.includes(currency) ? amount : amount / 100;
};

export const getHumanDiscount = (coupon: Coupon) => {
  if (coupon?.amount_off && coupon?.currency) {
    return getFormattedPrice({ amount: coupon.amount_off, currency: coupon.currency });
  }
  if (coupon?.percent_off) {
    // Translators: Percent off.
    return sprintf(__('%1d%% off', 'surecart'), coupon.percent_off | 0);
  }
  return '';
};

export const getFormattedDiscount = (coupon: Coupon) => {
  if (coupon?.percent_off) {
    return `${coupon.percent_off | 0}%`;
  }
  if (coupon?.amount_off && coupon?.currency) {
    return getFormattedPrice({ amount: coupon.amount_off, currency: coupon.currency });
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
  const formattedParts = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
  }).formatToParts();
  return formattedParts.find(part => part.type === 'currency')?.value;
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

export const translateAbbreviatedInterval = (amount: number, interval: string, fallback: string = __('once', 'surecart'), showSingle: boolean = false) => {
  switch (interval) {
    case 'day':
      return ` / ${sprintf(showSingle ? _n('%d day', '%d days', amount, 'surecart') : _n('day', '%d days', amount, 'surecart'), amount)}`;
    case 'week':
      return ` / ${sprintf(showSingle ? _n('%d wk', '%d wks', amount, 'surecart') : _n('wk', '%d wks', amount, 'surecart'), amount)}`;
    case 'month':
      return ` / ${sprintf(showSingle ? _n('%d mo', '%d months', amount, 'surecart') : _n('mo', '%d mos', amount, 'surecart'), amount)}`;
    case 'year':
      return ` / ${sprintf(showSingle ? _n('%d yr', '%d yrs', amount, 'surecart') : _n('yr', '%d yrs', amount, 'surecart'), amount)}`;
    default:
      return fallback;
  }
};

interface IntervalOptions {
  showOnce?: boolean;
  abbreviate?: boolean;
  labels?: {
    interval?: string;
    period?: string;
    once?: string;
  };
}
export const intervalString = (price: recurringPriceDetails, options: IntervalOptions = {}) => {
  if (!price) {
    return '';
  }
  const { showOnce, labels, abbreviate } = options;
  const { interval = __('every', 'surecart') } = labels || {};

  return `${intervalCountString(price, interval, !!showOnce ? __('once', 'surecart') : '', abbreviate)} ${periodCountString(price, abbreviate)}`;
};

export const intervalCountString = (
  price: { recurring_interval_count?: number; recurring_interval?: 'week' | 'month' | 'year' | 'never'; recurring_period_count: number },
  prefix,
  fallback = __('once', 'surecart'),
  abbreviate = false,
) => {
  if (!price.recurring_interval_count || !price.recurring_interval || 1 === price?.recurring_period_count) {
    return '';
  }
  if (abbreviate) {
    return translateAbbreviatedInterval(price.recurring_interval_count, price.recurring_interval, fallback);
  }
  return translateInterval(price.recurring_interval_count, price.recurring_interval, ` ${prefix}`, fallback);
};

export const periodCountString = (price: recurringPriceDetails, abbreviate = false) => {
  if (!price?.recurring_period_count || 1 === price?.recurring_period_count) {
    return '';
  }
  if (abbreviate) {
    return `x ${price.recurring_period_count}`;
  }

  return ` (${sprintf(_n('%d payment', '%d payments', price.recurring_period_count, 'surecart'), price.recurring_period_count)})`;
};

export const translateRemainingPayments = payments => {
  return sprintf(_n('%d payment remaining', '%d payments remaining', payments, 'surecart'), payments);
};

export const productNameWithPrice = price => {
  if (!price) {
    return '';
  }
  return `${price?.product?.name} ${price?.name ? `— ${price.name}` : ''}`;
};

export const getHumanDiscountRedeemableStatus = status => {
  switch (status) {
    case 'invalid':
      return __('Not valid', 'surecart');
    case 'expired':
      return __('Expired', 'surecart');
    case 'gone':
      return __('Not available', 'surecart');
    case 'less_than_min_subtotal_amount':
      return __('Minimum not met', 'surecart');
    case 'greater_than_max_subtotal_amount':
      return __('Order amount exceeds limit', 'surecart');
    case 'not_applicable':
      return __('Product(s) not eligible', 'surecart');
    case 'not_applicable_to_customer':
      return __('Not eligible', 'surecart');
    case '':
      return '';
    default:
      return __('Not redeemable', 'surecart');
  }
};
