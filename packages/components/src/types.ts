import { IconLibraryMutator, IconLibraryResolver } from './components/ui/icon/library';

declare global {
  interface Window {
    wp: {
      apiFetch: any;
      blocks: any;
      i18n: any;
    };
    registerSureCartIconPath: (path: string) => void;
    registerSureCartIconLibrary: (name: string, options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator }) => void;
    scIconPath: string;
    scData: {
      root_url: string;
      nonce: string;
      base_url: string;
      nonce_endpoint: string;
    };
    ceRegisterIconLibrary: any;
    ResizeObserver: any;
  }
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

interface Model {
  created_at: number;
  updated_at: number;
}

export interface ChoiceItem extends Object {
  value: string;
  label: string;
  disabled?: boolean;
  choices?: ChoiceItem[];
  suffix?: string;
  icon?: string;
}

export type ChoiceType = 'all' | 'single' | 'multiple';

export interface Price {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  recurring: boolean;
  recurring_interval?: 'week' | 'month' | 'year' | 'never';
  recurring_interval_count?: number;
  trial_duration_days?: number;
  ad_hoc: boolean;
  ad_hoc_max_amount: number;
  ad_hoc_min_amount: number;
  recurring_period_count: number;
  archived: boolean;
  product_id?: string;
  archived_at?: string;
  created_at: number;
  updated_at: number;
  product?: Product | string;
  metadata: { [key: string]: string };
}

export type Prices = {
  [id: string]: Price;
};

export interface File {
  id: string;
  object: 'file';
  byte_size: number;
  content_type: string;
  extension: string;
  filename: string;
  product: string | 'Product';
  created_at: number;
}

export type FormState = 'idle' | 'loading' | 'draft' | 'updating' | 'finalizing' | 'paid' | 'failure' | 'expired';
export type FormStateSetter = 'RESOLVE' | 'REJECT' | 'FINALIZE' | 'PAID' | 'EXPIRE' | 'FETCH';

export interface Product extends Object {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  archived_at: string;
  metadata: any;
  image_url: string;
  recurring: boolean;
  tax_category: string;
  tax_enabled: boolean;
  prices: {
    object: 'list';
    pagination: Pagination;
    data: Array<Price>;
  };
  files: {
    object: 'list';
    pagination: Pagination;
    data: Array<File>;
  };
  created_at: number;
  updated_at: number;
}

export type Products = {
  [id: string]: Product;
};

export interface Coupon extends Model {
  id: string;
  object: 'coupon';
  amount_off: number;
  valid?: boolean;
  expired: boolean;
  currency: string;
  duration: string;
  duration_in_months: number;
  max_redemptions: number;
  metadata: Object;
  name: string;
  percent_off: number;
  redeem_by: number;
  times_redeemed: number;
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

export interface InvoiceItem extends LineItem {}
export interface PriceChoice {
  id: string;
  product_id: string;
  quantity: number;
  enabled: boolean;
  selected?: boolean;
}

export type CheckoutState = 'idle' | 'loading' | 'draft' | 'updating' | 'finalized' | 'paid' | 'failure';

export type TaxStatus = 'disabled' | 'address_invalid' | 'reverse_charged' | 'tax_registration_not_found' | 'tax_zone_not_found' | 'estimated' | 'calculated';
export interface Invoice extends Object {
  id: string;
  object: 'invoice';
  currency: string;
  amount_due: number;
  invoice_items: {
    object: 'list';
    pagination: Pagination;
    data: Array<InvoiceItem>;
  };
  discount_amount: number;
  live_mode: boolean;
  metadata: object;
  number: string;
  period_end_at: number;
  period_start_at: number;
  proration_amount: number;
  processor_data: {
    stripe: object;
  };
  status: OrderStatus;
  subtotal_amount: number;
  tax_amount: number;
  tax_status: TaxStatus;
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
  url: string;
  created_at: number;
  updated_at: number;
}

export interface BillingAddress extends Object {}
export interface ShippingAddress extends Object {}
export interface ProductGroup {
  id: string;
  object: 'product_group';
  archived: boolean;
  archived_at: number;
  metadata: object;
  name: string;
  created_at: number;
  updated_at: number;
}
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
  amount_due?: number;
  trial_amount?: number;
  charge?: string | Charge;
  name?: string;
  email?: string;
  live_mode?: boolean;
  currency?: string;
  total_amount?: number;
  subtotal_amount?: number;
  tax_amount: number;
  tax_status: 'disabled' | 'address_invalid' | 'estimated' | 'calculated';
  tax_label: string;
  line_items: lineItems;
  metadata?: Object;
  payment_intent?: PaymentIntent;
  customer: string | Customer;
  subscriptions: {
    object: 'list';
    pagination: Pagination;
    data: Array<Subscription>;
  };
  discount_amount?: number;
  discount?: DiscountResponse;
  billing_address?: string | Address;
  shipping_address?: string | Address;
  shipping_enabled?: boolean;
  processor_data?: ProcessorData;
  tax_identifier?: {
    number: string;
    number_type: string;
  };
  url: string;
  created_at?: number;
}

export interface ProcessorData {
  stripe: {
    account_id: string;
    publishable_key: string;
    client_secret?: string;
    type: 'payment' | 'setup';
  };
  paypal: {
    account_id: string;
    client_id: string;
  };
}

export interface Processor {
  live_mode: boolean;
  processor_data: {
    account_id: string;
    recurring_enabled: boolean;
    client_id: string;
  };
  recurring_enabled: boolean;
  processor_type: 'paypal' | 'stripe';
}

export interface Purchase {
  id: string;
  object: 'purchase';
  live_mode: boolean;
  quantity: number;
  revoked: boolean;
  revoked_at: number;
  customer: string | Customer;
  invoice_item: string | InvoiceItem;
  invoice: string | Invoice;
  line_item: string | LineItem;
  order: string | Order;
  product: string | Product;
  refund: string | Refund;
  subscription: string | Subscription;
  created_at: number;
  updated_at: number;
}

export interface Refund {
  id: string;
  object: 'refund';
  amount: number;
  currency: string;
  external_refund_id: string;
  live_mode: boolean;
  metadata: object;
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  charge: string | Charge;
  customer: string | Customer;
  revoked_purchases: null | Array<Purchase>;
  created_at: number;
  updated_at: number;
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
  pending_update: {
    ad_hoc_amount?: number;
    price?: string;
    quantity?: number;
  };
  cancel_at_period_end: number | false;
  current_period_end_at: number | false;
  current_period_start_at: number | false;
  remaining_period_count: number | null;
  ended_at: number;
  end_behavior: 'cancel' | 'complete';
  payment_method: PaymentMethod | string;
  price: Price;
  ad_hoc_amount: number;
  created_at: number;
  updated_at: number;
}

export interface SubscriptionProtocol {
  id: string;
  object: 'subscription_protocol';
  cancel_behavior: 'pending' | 'immediate';
  downgrade_behavior: 'pending' | 'immediate';
  payment_retry_window_weeks: number;
  upgrade_behavior: 'pending' | 'immediate';
  created_at: number;
  updated_at: number;
}

export type SubscriptionStatus = 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'completed';

export type OrderStatus = 'draft' | 'finalized' | 'paid' | 'completed';

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

export interface DiscountResponse {
  coupon?: Coupon;
  id: string;
  object: 'discount';
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

export type ProcessorName = 'stripe' | 'paypal' | 'paypal-card';

export interface PaymentIntent extends Object {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  processor_type: 'stripe' | 'paypal';
  status: 'pending' | 'succeeded' | 'canceled';
  external_intent_id: string;
  live_mode: boolean;
  processor_data: ProcessorData;
  customer: Customer | string;
  created_at: number;
  updated_at: number;
}

export interface PaymentIntents {
  stripe?: PaymentIntent;
  paypal?: PaymentIntent;
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

export interface WordPressUser {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
}
export interface Customer extends Object {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  billing_address?: string | Address;
  shipping_address?: string | Address;
  billing_matches_shipping: boolean;
  live_mode: boolean;
  unsubscribed: boolean;
  default_payment_method: string | PaymentMethod;
  tax_identifier: {
    number: string;
    number_type: string;
  };
  created_at: number;
  updated_at: number;
}

export interface Address extends Object {
  name?: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PriceData extends Object {
  price_id: string;
  quantity: number;
  removeable: boolean;
}
