/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { people as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Contact Section', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Order contact details', 'checkout_engine' ),
	supports: {
		reusable: false,
		inserter: false,
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
	// this is a dynamic block
};

export { name, category, metadata, settings };
