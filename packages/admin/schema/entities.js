import { schema } from 'normalizr';

export default {
	price: new schema.Entity('price'),
	product: new schema.Entity('product'),
	purchase: new schema.Entity('purchase'),
	payment_method: new schema.Entity('payment_method'),
	card: new schema.Entity('card'),
	invoice: new schema.Entity('invoice'),
	latest_invoice: new schema.Entity('latest_invoice'),
	refund: new schema.Entity('refund'),
	charge: new schema.Entity('charge'),
	order: new schema.Entity('order'),
	customer: new schema.Entity('customer'),
	subscription: new schema.Entity('subscription'),
};
