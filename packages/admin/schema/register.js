import { store as dataStore } from '@surecart/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'order',
		baseURL: 'surecart/v1/orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'charge',
		baseURL: 'surecart/v1/charges',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'invoice',
		baseURL: 'surecart/v1/invoices',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscription',
		baseURL: 'surecart/v1/subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'product',
		baseURL: 'surecart/v1/products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'product-group',
		baseURL: 'surecart/v1/product-groups',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'price',
		baseURL: 'surecart/v1/prices',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'purchase',
		baseURL: 'surecart/v1/purchases',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'payment_method',
		baseURL: 'surecart/v1/payment_methods',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer',
		baseURL: 'surecart/v1/customers',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'line_item',
		baseURL: 'surecart/v1/line_items',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'coupon',
		baseURL: 'surecart/v1/coupons',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'promotion',
		baseURL: 'surecart/v1/promotions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'product_group',
		baseURL: 'surecart/v1/product_groups',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'refund',
		baseURL: 'surecart/v1/refunds',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'setting',
		baseURL: 'surecart/v1/settings',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'account',
		baseURL: 'surecart/v1/account',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer_notification_protocol',
		baseURL: 'surecart/v1/customer_notification_protocol',
		baseURLParams: { context: 'edit' },
	},
]);
