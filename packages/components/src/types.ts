declare global {
  interface Window {
    wp: {
      apiFetch: any;
      blocks: any;
    };
    checkout_engine: {
      root_url: string;
      nonce: string;
      nonce_endpoint: string;
    };
  }
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export interface ChoiceItem extends Object {
  value: string;
  label: string;
  disabled?: boolean;
  choices?: ChoiceItem[];
  suffix?: string;
}

export type ChoiceType = 'all' | 'single' | 'multiple';

export interface Price {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  recurring: boolean;
  recurring_interval?: 'day' | 'week' | 'month' | 'year';
  recurring_interval_count?: number;
  trial_duration_days?: number;
  ad_hoc: boolean;
  ad_hoc_max_amount: number;
  ad_hoc_min_amount: number;
  archived: boolean;
  product_id?: string;
  archived_at?: string;
  created_at: number;
  updated_at: number;
  product?: Product | string;
  metadata: { [key: string]: string };
}

export type Prices = {
  [id: string]: {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    recurring: boolean;
    recurring_interval?: 'day' | 'week' | 'month' | 'year';
    recurring_interval_count?: number;
    ad_hoc: boolean;
    ad_hoc_max_amount: number;
    ad_hoc_min_amount: number;
    archived: boolean;
    product_id?: string;
    archived_at?: string;
    created_at: number;
    updated_at: number;
    product?: string;
    metadata: { [key: string]: string };
  };
};

export interface Product extends Object {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  metadata: any;
  image_url: string;
  prices: Array<Price>;
  created_at: number;
  updated_at: number;
}

export type Products = {
  [id: string]: Product;
};

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
  ad_hoc_amount?: number;
}

export type LineItemsData = {
  [id: string]: Array<LineItemData>;
};

export interface LineItem extends Object {
  id?: string;
  ad_hoc_amount?: number;
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
export interface PriceChoice {
  id: string;
  product_id: string;
  quantity: number;
  enabled: boolean;
  selected?: boolean;
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
  number?: string;
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
  billing_addresss?: Address;
  shipping_addresss?: Address;
}

export interface Subscription extends Object {
  id: string;
  object: 'subscription';
  currency?: string;
  status: SubscriptionStatus;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  live_mode: boolean;
  external_subscription_id: string;
  trial_end_at: number;
  processor_type: 'stripe' | 'paypal';
  checkout_session: CheckoutSession;
  customer: Customer;
  discount: DiscountResponse;
  payment_method: PaymentMethod | string;
  subscription_items: {
    object: 'list';
    pagination: Pagination;
    data: Array<SubscriptionItem>;
  };
  created_at: number;
  updated_at: number;
}

export type SubscriptionItem = {
  id: string;
  object: 'subscription_item';
  quantity: number;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  price: Price | string;
  subscription: Subscription | string;
  created_at: number;
  updated_at: number;
};

export type SubscriptionStatus = 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

export interface PaymentMethod extends Object {
  id: string;
  object: 'payment_method';
  live_mode: boolean;
  external_payment_method_id: string;
  processor_type: 'stripe' | 'paypal';
  type: string;
  payment_intent: PaymentIntent | string;
  card: any;
  customer: Customer | string;
  created_at: number;
  updated_at: number;
}

export interface Pagination {
  count: number;
  limit: number;
  page: number;
  url: string;
}

export interface lineItems extends Object {
  object: 'list';
  pagination: Pagination;
  data: Array<LineItem>;
}

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

export interface ResponseError {
  code: string;
  message: string;
  data: {
    http_status: string;
    status?: number;
    type: string;
  };
  additional_errors: Array<{
    code: string;
    message: string;
    data: {
      attribute: string;
      options: Array<string>;
      type: string;
    };
  }>;
}

export interface PaymentIntent extends Object {
  id: string;
  object: string;
  processor_type: string;
  external_intent_id: string;
  external_client_secret: string;
  external_type: 'setup' | 'payment';
  created_at: number;
  updated_at: number;
}

export interface SetupIntent extends Object {
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
