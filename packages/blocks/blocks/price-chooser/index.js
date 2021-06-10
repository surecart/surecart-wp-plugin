/**
 * Internal dependencies
 */
import edit from './edit';
//  import save from './save';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { blockDefault as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Price Chooser', 'checkout_engine' ),
	/* translators: block description */
	description: __(
		'Display a price chooser for the checkout',
		'checkout_engine'
	),
	parent: [ 'checkout-engine/checkout-form' ],
	supports: {
		reusable: false,
		// inserter: false, //eventually
	},
	icon,
	keywords: [
		'checkout',
		'engine',
		/* translators: block keyword */
		__( 'shop', 'checkout_engine' ),
		/* translators: block keyword */
		__( 'button', 'checkout_engine' ),
	],
	attributes,
	edit,
	// save,
};

export { name, category, metadata, settings };
