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

export interface LineItem extends Object {
  id: string;
  object: string;
  quantity: number;
  amount_subtotal: number;
  amount_total: number;
  created_at: number;
  updated_at: number;
  price: Price;
}

export interface CheckoutSession extends Object {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  currency: string;
  line_items: Array<LineItem>;
}
