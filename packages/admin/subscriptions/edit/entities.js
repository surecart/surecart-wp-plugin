import { store as dataStore } from '../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
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
]);
