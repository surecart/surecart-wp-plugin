import { dispatch } from '@wordpress/data';
import { store as dataStore } from '../../store/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'product',
		baseURL: 'products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'price',
		baseURL: 'prices',
		baseURLParams: { context: 'edit' },
	},
]);
