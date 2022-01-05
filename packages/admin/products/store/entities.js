import { dispatch } from '@wordpress/data';
import { store as dataStore } from '../../store/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'products',
		baseURL: 'products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'prices',
		baseURL: 'prices',
		baseURLParams: { context: 'edit' },
	},
] );
