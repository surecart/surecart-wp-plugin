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
import { edit as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes } = metadata;
import { BLOCK_PARENTS } from '../../blocks';

const settings = {
	/* translators: block name */
	title: __( 'Checkbox', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Display a checkbox input', 'checkout_engine' ),
	parent: BLOCK_PARENTS,
	supports: {
		reusable: false,
		html: false,
	},
	icon,
	keywords: [
		'checkout',
		'engine',
		/* translators: block keyword */
		__( 'checkbox', 'checkout_engine' ),
		/* translators: block keyword */
		__( 'check', 'checkout_engine' ),
	],
	attributes,
	edit,
	save,
};

export { name, category, metadata, settings };
