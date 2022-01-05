/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { store } from '@wordpress/core-data';

dispatch( store ).addEntities( [
	{
		name: 'product',
		kind: 'root',
		label: __( 'Product', 'checkout_engine' ),
		baseURL: 'checkout-engine/v1/products',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'price',
		kind: 'root',
		label: __( 'Price', 'checkout_engine' ),
		baseURL: 'checkout-engine/v1/prices',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'upgrade_path',
		kind: 'root',
		label: __( 'Upgrade Path', 'checkout_engine' ),
		baseURL: 'checkout-engine/v1/upgrade-paths',
		baseURLParams: { context: 'edit' },
	},
] );
