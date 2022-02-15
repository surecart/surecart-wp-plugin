import { store as dataStore } from '@checkout-engine/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'order',
		baseURL: 'checkout-engine/v1/orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'charge',
		baseURL: 'checkout-engine/v1/charges',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'invoice',
		baseURL: 'checkout-engine/v1/invoices',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscription',
		baseURL: 'checkout-engine/v1/subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'product',
		baseURL: 'checkout-engine/v1/products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'purchase',
		baseURL: 'checkout-engine/v1/purchases',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'payment_method',
		baseURL: 'checkout-engine/v1/payment_methods',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer',
		baseURL: 'checkout-engine/v1/customers',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'line_item',
		baseURL: 'checkout-engine/v1/line_items',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'coupon',
		baseURL: 'checkout-engine/v1/coupons',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'promotion',
		baseURL: 'checkout-engine/v1/promotions',
		baseURLParams: { context: 'edit' },
	},
]);
