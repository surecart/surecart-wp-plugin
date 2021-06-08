export interface Price extends Object {
  id: string;
  name: string;
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
