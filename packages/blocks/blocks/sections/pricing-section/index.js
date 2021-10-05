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
import { buttons as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes, supports } = metadata;
import { BLOCK_PARENTS } from '../../../blocks';

const settings = {
	/* translators: block name */
	title: __( 'Pricing Section', 'checkout_engine' ),
	/* translators: block description */
	description: __(
		'Display a price chooser for the checkout',
		'checkout_engine'
	),
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
	// this is a dynamic block in case prices update
};

export { name, category, metadata, settings };
