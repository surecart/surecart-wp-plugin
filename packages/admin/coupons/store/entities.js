import { dispatch } from '@wordpress/data';
import { store as dataStore } from '../../store/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'promotions',
		baseURL: 'promotions',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'coupons',
		baseURL: 'coupons',
		baseURLParams: { context: 'edit' },
	},
] );
