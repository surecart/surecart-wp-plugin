import { dispatch } from '@wordpress/data';
import { store as dataStore } from '../../store/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'checkout_sessions',
		baseURL: 'checkout_sessions',
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
