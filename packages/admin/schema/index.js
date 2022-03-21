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
	coupon,
	promotion,
	order,
	customer,
	product_group,
	subscription,
} = entities;

product.define({
	prices: {
		data: [price],
	},
	product_group,
});

price.define({
	product,
});

invoice.define({
	purchases: {
		data: [purchase],
	},
	charge,
	customer,
	subscription,
});

order.define({
	purchases: {
		data: [purchase],
	},
	charge,
	customer,
	subscription,
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
	order,
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

coupon.define({
	promotions: {
		data: [promotion],
	},
});

product_group.define({});

export const normalizeEntities = (data) => {
	if (entities?.[data?.[0]?.object]) {
		return normalize(data, [entities[data?.[0]?.object]]);
	}
	return {};
};

export const normalizeEntity = (data) => {
	if (entities?.[data?.object]) {
		return normalize(data, entities[data.object]);
	}
	return {};
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
