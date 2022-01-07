import { store as dataStore } from '../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'orders',
		baseURL: 'orders',
		baseURLParams: { context: 'edit' },
		editLink: 'page=ce-orders&action=edit',
	},
	{
		name: 'subscriptions',
		baseURL: 'subscriptions',
		baseURLParams: { context: 'edit' },
		editLink: ceData?.links?.subscriptions,
	},
	{
		name: 'customers',
		baseURL: 'customers',
		baseURLParams: { context: 'edit' },
		editLink: ceData?.links?.customers,
	},
	{
		name: 'charges',
		baseURL: 'charges',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'line_items',
		baseURL: 'line_items',
		baseURLParams: { context: 'edit' },
	},
] );
