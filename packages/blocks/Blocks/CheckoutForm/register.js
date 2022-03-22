import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

registerBlockType('surecart/checkout-form', {
	// name: 'surecart/checkout-form',
	title: 'Checkout Form',
	description: 'Display a checkout form',
	category: 'layout',
	keywords: ['checkout', 'form'],
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
});
