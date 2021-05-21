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
import { button as icon } from '@wordpress/icons';

/**
 * Block constants
 */
const { name, category, attributes } = metadata;

const settings = {
	/* translators: block name */
	title: __( 'Checkout Form', 'checkout_engine' ),
	/* translators: block description */
	description: __( 'Display a checkout form', 'checkout_engine' ),
	icon,
	keywords: [
		'checkout',
		'engine',
		/* translators: block keyword */
		__( 'shop', 'coblocks' ),
		/* translators: block keyword */
		__( 'cart', 'coblocks' ),
	],
	attributes,
	edit,
	save,
};

export { name, category, metadata, settings };
