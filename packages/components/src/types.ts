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
