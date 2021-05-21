/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { button as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Button', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Display a checkout form button', 'checkout_engine' ),
	parent: [ 'checkout-engine/checkout-form' ],
	supports: {
		reusable: false,
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
};

export { name, category, metadata, settings };
