/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { payment as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;
import { BLOCK_PARENTS } from '../../../blocks';

const settings = {
	/* translators: block name */
	title: __( 'Payment Section', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Order payment section.', 'checkout_engine' ),
	parent: BLOCK_PARENTS,
	supports: {
		reusable: false,
		multiple: false,
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
};

export { name, category, metadata, settings };
