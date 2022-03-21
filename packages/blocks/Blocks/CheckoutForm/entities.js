/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { store } from '@wordpress/core-data';

dispatch(store).addEntities([
	{
		name: 'product',
		kind: 'root',
		label: __('Product', 'surecart'),
		baseURL: 'checkout-engine/v1/products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'price',
		kind: 'root',
		label: __('Price', 'surecart'),
		baseURL: 'checkout-engine/v1/prices',
		baseURLParams: { context: 'edit' },
	},
]);
