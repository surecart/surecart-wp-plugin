declare global {
  interface Window {
    wp: {
      apiFetch: any;
    };
    checkout_engine: {
      root_url: string;
      nonce: string;
      nonce_endpoint: string;
    };
  }
}

export interface ChoiceItem extends Object {
  value: string;
  label: string;
}
export type ChoiceType = 'all' | 'single' | 'multiple';

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export interface Price extends Object {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  recurring: boolean;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  recurring_interval_count?: number;
  active: boolean;
  product_id?: string;
  archived_at?: string;
  created_at: number;
  updated_at: number;
  product?: Product;
  metadata: { [key: string]: string };
}

export interface Product extends Object {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: any;
  prices: Array<Price>;
  created_at: number;
  updated_at: number;
}

export interface Coupon extends Object {
  id: string;
  amount_off: number;
  created: number;
  currency: string;
  duration: string;
  duration_in_months: number;
  livemode: boolean;
  max_redemptions: number;
  metadata: Object;
  name: string;
  percent_off: number;
  redeem_by: number;
  times_redeemed: number;
  valid: boolean;
}

export interface LineItemData extends Object {
  price_id: string;
  quantity: number;
}

export interface LineItem extends Object {
  id?: string;
  name: string;
  object: string;
  quantity: number;
  subtotal_amount: number;
  total_amount: number;
  created_at: number;
  updated_at: number;
  price?: Price;
  price_id: string;
}

export interface ProductChoices {
  [id: string]: ProductChoice;
}

export interface ProductChoice {
  prices: {
    [id: string]: {
      quantity: number;
      enabled: boolean;
    };
  };
}

export interface Keys extends Object {
  stripe?: string;
  stripeAccountId?: string;
  paypal?: string;
}

export type CheckoutState = 'idle' | 'loading' | 'draft' | 'updating' | 'finalized' | 'paid' | 'failure';

export interface CheckoutSession extends Object {
  id?: string;
  status?: 'finalized' | 'draft' | 'paid';
  name?: string;
  email?: string;
  currency?: string;
  total_amount?: number;
  subtotal_amount?: number;
  line_items: lineItems;
  metadata?: Object;
  payment_intent?: PaymentIntent;
  discount_amount?: number;
  discount?: DiscountResponse;
}

export type lineItems = Array<LineItem>;

export interface Promotion extends Object {
  code: string;
  created_at: number;
  expired: boolean;
  id: string;
  max_redemptions: number;
  metadata: Object;
  object: 'promotion';
  redeem_by: string;
  times_redeemed: number;
}

export interface DiscountResponse extends Object {
  coupon?: Coupon;
  created_at: string;
  updated_at: string;
  id: string;
  object: string;
  promotion: Promotion;
}

export interface PaymentIntent extends Object {
  id: string;
  object: string;
  processor_type: string;
  external_intent_id: string;
  external_client_secret: string;
  created_at: number;
  updated_at: number;
}

export interface Customer extends Object {
  email: string;
  name?: string;
  phone?: string;
  billing_address?: Address;
  shipping_address?: Address;
}

export interface Address extends Object {
  name?: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  destroy?: boolean;
}

export interface PriceData extends Object {
  price_id: string;
  quantity: number;
  removeable: boolean;
}
