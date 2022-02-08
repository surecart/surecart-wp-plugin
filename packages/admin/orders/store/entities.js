import { __ } from '@wordpress/i18n';
import { store as dataStore } from '../../store/data';
import { store as coreStore } from '@wordpress/core-data';
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
		name: 'customer',
		baseURL: 'checkout-engine/v1/customers',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'line_item',
		baseURL: 'checkout-engine/v1/line_items',
		baseURLParams: { context: 'edit' },
	},
]);

dispatch(coreStore).addEntities([
	{
		name: 'charge',
		kind: 'root',
		label: __('Charge', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/charges',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
	{
		name: 'invoice',
		kind: 'root',
		label: __('Invoice', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/invoices',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
	{
		name: 'subscription',
		kind: 'root',
		label: __('Subscription', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/subscriptions',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
	{
		name: 'product',
		kind: 'root',
		label: __('Product', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/products',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
	{
		name: 'purchase',
		kind: 'root',
		label: __('Purchase', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/purchases',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
	{
		name: 'customer',
		kind: 'root',
		label: __('Customer', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/customers',
		baseURLParams: { context: 'edit' },
		__experimentalNoFetch: true,
	},
]);
