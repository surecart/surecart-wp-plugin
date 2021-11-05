import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

registerBlockType( 'checkout-engine/checkout-form', {
	// name: 'checkout-engine/checkout-form',
	title: 'Checkout Form',
	description: 'Display a checkout form',
	category: 'layout',
	keywords: [ 'checkout', 'form' ],
	supports: {
		reusable: false,
		html: false,
	},
	attributes: {
		id: {
			type: 'number',
		},
		title: {
			type: 'string',
		},
	},
	edit,
} );
