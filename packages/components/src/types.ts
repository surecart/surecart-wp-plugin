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
export interface Price extends Object {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  recurring: boolean;
  recurring_interval: 'day' | 'week' | 'month' | 'year';
  recurring_interval_count: number;
  active: boolean;
  metadata: any;
  product_id: string;
  created_at: string;
  updated_at: string;
  product: Product;
  meta_data: { [key: string]: string };
}

export interface Product extends Object {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
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
  amount_subtotal: number;
  amount_total: number;
  created_at: number;
  updated_at: number;
  price?: Price;
  price_id: string;
}

export interface CheckoutSession extends Object {
  id?: string;
  status?: 'finalized' | 'draft' | 'paid';
  name?: string;
  email?: string;
  currency?: string;
  amount_total?: number;
  amount_subtotal?: number;
  line_items: Array<LineItem>;
  metadata?: Object;
  processor_intent?: ProcessorIntent;
}

export interface ProcessorIntent extends Object {
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
