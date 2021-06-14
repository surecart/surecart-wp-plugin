import { Price } from '../../../types';

const DefaultValue: {
  prices: Array<Price>;
  loading: boolean;
  submitting: boolean;
  price_ids: Array<string>;
  total: number;
  paymentMethod: 'stripe' | 'paypal';
  stripePublishableKey?: string;
} = {
  loading: false,
  submitting: false,
  prices: [],
  price_ids: [],
  total: 0,
  paymentMethod: 'stripe',
};

export default DefaultValue;
