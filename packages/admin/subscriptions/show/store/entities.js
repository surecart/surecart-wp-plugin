import { store as dataStore } from '../../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'order',
		baseURL: 'surecart/v1/orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscription',
		baseURL: 'surecart/v1/subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer',
		baseURL: 'surecart/v1/customers',
		baseURLParams: { context: 'edit' },
	},
]);
