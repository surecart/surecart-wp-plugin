import { store as dataStore } from '../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'customers',
		baseURL: 'customers',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'orders',
		baseURL: 'orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'charges',
		baseURL: 'charges',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'invoices',
		baseURL: 'invoices',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscriptions',
		baseURL: 'subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'refunds',
		baseURL: 'refunds',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'payment_methods',
		baseURL: 'payment_methods',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer_notification_protocols',
		baseURL: 'customer_notification_protocols',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'abandonded_orders',
		baseURL: 'abandonded_orders',
		baseURLParams: { context: 'edit' },
	},
]);
