import { normalize, schema } from 'normalizr';

export { normalize, schema };

const entities = {
	price: new schema.Entity('price'),
	product: new schema.Entity('product'),
	purchase: new schema.Entity('purchase'),
	invoice: new schema.Entity('invoice'),
	refund: new schema.Entity('refund'),
	charge: new schema.Entity('charge'),
	order: new schema.Entity('order'),
	customer: new schema.Entity('customer'),
	subscription: new schema.Entity('subscription'),
};

entities.product.define({
	prices: {
		data: [entities.price],
	},
});
entities.price.define({
	product: entities.product,
});
entities.invoice.define({
	purchases: {
		data: [entities.purchase],
	},
	subscription: entities.subscription,
});
entities.order.define({
	purchases: {
		data: [entities.purchase],
	},
});
entities.charge.define({
	order: entities.order,
	invoice: entities.invoice,
});
entities.subscription.define({
	latest_invoice: entities.invoice,
	purchase: entities.purchase,
	price: entities.price,
});
entities.refund.define({
	charge: entities.charge,
	customer: entities.customer,
});
entities.purchase.define({
	order: entities.order,
	product: entities.product,
	subscription: entities.subscription,
});

export const normalizeEntities = (data) => {
	if (entities?.[data?.[0]?.object]) {
		return normalize(data, [entities[data?.[0]?.object]]);
	}
};

export const normalizeEntity = (data) => {
	if (entities?.[data?.object]) {
		return normalize(data, entities[data.object]);
	}
};

// normalize price data
export const normalizePrices = (prices) => {
	return normalize({ prices }, { prices: [entities.price] });
};

// normalize price data
export const normalizeProducts = (products) => {
	return normalize({ products }, { products: [entities.product] });
};

// normalize price data
export const normalizeProduct = (data) => {
	return normalize(data, entities.product);
};
