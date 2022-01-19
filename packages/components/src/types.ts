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
    ceRegisterIconLibrary: any;
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

export type CheckoutState = 'idle' | 'loading' | 'draft' | 'updating' | 'finalized' | 'paid' | 'failure';

export interface Invoice extends Object {
  id: string;
  object: 'invoice';
  currency: string;
  discount_amount: number;
  live_mode: boolean;
  metadata: object;
  number: string;
  period_end_at: number;
  period_start_at: number;
  processor_data: {
    stripe: object;
  };
  status: 'draft' | 'finalized' | 'paid';
  subtotal_amount: number;
  tax_amount: number;
  tax_calculation_status:
    | 'disabled'
    | 'shipping_address_required'
    | 'shipping_address_country_required'
    | 'shipping_address_state_required'
    | 'shipping_address_postal_code_required'
    | 'tax_registration_not_found'
    | 'estimated'
    | 'calculated';
  tax_label: string;
  total_amount: number;
  billing_address: string | BillingAddress;
  charge: string | Charge;
  customer: string | Customer;
  discount: string | object;
  payment_intent: string | PaymentIntent;
  payment_method: string | PaymentMethod;
  shipping_address: string | ShippingAddress;
  subscription: string | Subscription;
  tax_identifier: string | object;
  created_at: number;
  updated_at: number;
}

export interface BillingAddress extends Object {}
export interface ShippingAddress extends Object {}
export interface Charge extends Object {
  amount: number;
  created_at: number;
  currency: string;
  customer: string | Customer;
  external_charge_id: string;
  fully_refunded: boolean;
  id: string;
  invoice: string | Invoice;
  live_mode: boolean;
  object: 'charge';
  order: string | Order;
  payment_method: string | PaymentMethod;
  refunded_amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  updated_at: number;
}
export interface Order extends Object {
  id?: string;
  status?: 'finalized' | 'draft' | 'paid';
  number?: string;
  charge?: string | Charge;
  name?: string;
  email?: string;
  live_mode?: boolean;
  currency?: string;
  total_amount?: number;
  subtotal_amount?: number;
  tax_amount: number;
  tax_calculation_status:
    | 'disabled'
    | 'shipping_address_required'
    | 'shipping_address_country_required'
    | 'shipping_address_state_required'
    | 'shipping_address_postal_code_required'
    | 'tax_registration_not_found'
    | 'estimated'
    | 'calculated';
  tax_label: string;
  line_items: lineItems;
  metadata?: Object;
  payment_intent?: PaymentIntent;
  subscriptions: {
    object: 'list';
    pagination: Pagination;
    data: Array<Subscription>;
  };
  discount_amount?: number;
  discount?: DiscountResponse;
  billing_addresss?: Address;
  shipping_addresss?: Address;
  processor_data?: ProcessorData;
  created_at?: number;
}

export interface ProcessorData {
  stripe: {
    account_id: string;
    publishable_key: string;
    client_secret?: string;
    type: 'payment' | 'setup';
  };
}

export interface Subscription extends Object {
  id: string;
  object: 'subscription';
  currency?: string;
  status: SubscriptionStatus;
  live_mode: boolean;
  external_subscription_id: string;
  trial_end_at: number;
  processor_type: 'stripe' | 'paypal';
  order: Order;
  latest_invoice: string | Invoice;
  customer: Customer;
  discount: DiscountResponse;
  cancel_at_period_end: number | false;
  current_period_end_at: number | false;
  current_period_start_at: number | false;
  ended_at: number;
  payment_method: PaymentMethod | string;
  price: Price;
  created_at: number;
  updated_at: number;
}

export type SubscriptionStatus = 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';

export type OrderStatus = 'draft' | 'finalized' | 'paid';

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
  object: 'payment_intent';
  processor_type: 'stripe' | 'paypal';
  status: 'pending' | 'succeeded' | 'canceled';
  external_intent_id: string;
  live_mode: boolean;
  processor_data: ProcessorData;
  customer: Customer | string;
  created_at: number;
  updated_at: number;
}

export interface SetupIntent extends Object {
  id: string;
  object: 'setup_intent';
  processor_type: 'stripe' | 'paypal';
  status: 'pending' | 'succeeded' | 'canceled';
  external_intent_id: string;
  live_mode: boolean;
  processor_data: ProcessorData;
  customer: Customer | string;
  created_at: number;
  updated_at: number;
}

export interface Customer extends Object {
  id: string;
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
