/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
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
import { BLOCK_PARENTS } from '../../blocks';

const settings = {
	/* translators: block name */
	title: __( 'Submit', 'checkout_engine' ),
	/* translators: block description */
	description: __(
		'Display a checkout form submit button',
		'checkout_engine'
	),
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
	save,
};

export { name, category, metadata, settings };
