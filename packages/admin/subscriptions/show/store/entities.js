import { store as dataStore } from '../../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'order',
		baseURL: 'checkout-engine/v1/orders',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'subscription',
		baseURL: 'checkout-engine/v1/subscriptions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'customer',
		baseURL: 'checkout-engine/v1/customers',
		baseURLParams: { context: 'edit' },
	},
]);
