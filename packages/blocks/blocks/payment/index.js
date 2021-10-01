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

const settings = {
	/* translators: block name */
	title: __( 'Payment', 'checkout_engine' ),
	/* translators: block description */
	description: __(
		'Displays a credit card payment section.',
		'checkout_engine'
	),
	parent: [
		'checkout-engine/form-row',
		'checkout-engine/form-section',
		'checkout-engine/checkout-form',
	],
	icon,
	keywords: [
		'checkout',
		'engine',
		/* translators: block keyword */
		__( 'payment', 'checkout_engine' ),
		/* translators: block keyword */
		__( 'credit', 'checkout_engine' ),
	],
	attributes,
	edit,
	save,
};

export { name, category, metadata, settings };
