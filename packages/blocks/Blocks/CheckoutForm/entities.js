/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { store } from '@wordpress/core-data';

dispatch(store).addEntities([
	{
		name: 'product',
		kind: 'surecart',
		label: __('Product', 'surecart'),
		baseURL: '/surecart/v1/products',
		baseURLParams: { context: 'edit' },
		supportsPagination: true,
	},
	{
		name: 'price',
		kind: 'surecart',
		label: __('Price', 'surecart'),
		baseURL: '/surecart/v1/prices',
		baseURLParams: { context: 'edit' },
	},
]);
