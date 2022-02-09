import { normalize, schema } from 'normalizr';
import entities from './entities';

const {
	price,
	product,
	purchase,
	payment_method,
	card,
	invoice,
	refund,
	charge,
	order,
	customer,
	subscription,
} = entities;

product.define({
	prices: {
		data: [price],
	},
});

price.define({
	product,
});

invoice.define({
	purchases: {
		data: [purchase],
	},
	subscription,
});

order.define({
	purchases: {
		data: [purchase],
	},
});

charge.define({
	order,
	invoice,
});

subscription.define({
	latest_invoice: invoice,
	purchase,
	price,
	payment_method,
	customer,
});

refund.define({
	charge,
	customer,
});

purchase.define({
	order,
	product,
	subscription,
});

payment_method.define({
	card,
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

export { normalize, schema };
