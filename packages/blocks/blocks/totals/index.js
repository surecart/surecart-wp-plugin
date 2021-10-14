/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { currencyDollar as icon } from '@wordpress/icons';
import { BLOCK_PARENTS } from '../../blocks';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Totals Section', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Display a order total', 'checkout_engine' ),
	parent: BLOCK_PARENTS,
	supports: {
		reusable: false,
		// multiple: false,
		html: false,
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
