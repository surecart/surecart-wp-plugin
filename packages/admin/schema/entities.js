import { schema } from 'normalizr';

export default {
	integration: new schema.Entity('integration'),
	account: new schema.Entity('account'),
	price: new schema.Entity('price'),
	product: new schema.Entity('product'),
	product_group: new schema.Entity('product_group'),
	purchase: new schema.Entity('purchase'),
	payment_method: new schema.Entity('payment_method'),
	card: new schema.Entity('card'),
	invoice: new schema.Entity('invoice'),
	latest_period: new schema.Entity('latest_period'),
	refund: new schema.Entity('refund'),
	charge: new schema.Entity('charge'),
	coupon: new schema.Entity('coupon'),
	promotion: new schema.Entity('promotion'),
	order: new schema.Entity('order'),
	customer: new schema.Entity('customer'),
	subscription: new schema.Entity('subscription'),
	product_group: new schema.Entity('product_group'),
};
