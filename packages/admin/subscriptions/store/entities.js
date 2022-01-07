import { store as dataStore } from '../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'orders',
		baseURL: 'orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscriptions',
		baseURL: 'subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customers',
		baseURL: 'customers',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscription_items',
		baseURL: 'subscription_items',
		baseURLParams: { context: 'edit' },
	},
] );
