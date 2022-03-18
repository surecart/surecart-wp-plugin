import { Price } from '../../../types';

const DefaultValue: {
  prices: Array<Price>;
  loading: boolean;
  submitting: boolean;
  price_ids: Array<string>;
  selectedPriceIds?: Array<string>;
  total: number;
  processor: 'stripe' | 'paypal';
  stripePublishableKey?: string;
} = {
  loading: false,
  submitting: false,
  prices: [],
  price_ids: [],
  total: 0,
  processor: 'stripe',
};

export default DefaultValue;
