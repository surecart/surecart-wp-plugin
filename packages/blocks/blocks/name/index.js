/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { receipt as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Name', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Display name collection fields', 'checkout_engine' ),
	icon,
	keywords: [
		'checkout',
		'engine',
		/* translators: block keyword */
		__( 'shop', 'checkout_engine' ),
		/* translators: block keyword */
		__( 'cart', 'checkout_engine' ),
	],
	attributes,
	edit,
	save,
};

export { name, category, metadata, settings };
