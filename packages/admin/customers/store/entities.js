import { store as dataStore } from '../../store/data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch( dataStore ).registerEntities( [
	{
		name: 'customers',
		baseURL: 'customers',
		baseURLParams: { context: 'edit' },
	},
] );
