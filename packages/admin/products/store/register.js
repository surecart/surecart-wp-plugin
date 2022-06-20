import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'product',
		kind: 'surecart',
		label: __('Product', 'surecart'),
		baseURL: 'surecart/v1/products',
		baseURLParams: { context: 'edit', expand: ['files'], cached: 0 },
	},
	{
		name: 'price',
		kind: 'surecart',
		label: __('Price', 'surecart'),
		baseURL: 'surecart/v1/prices',
		baseURLParams: { context: 'edit', cached: 0 },
	},
]);
