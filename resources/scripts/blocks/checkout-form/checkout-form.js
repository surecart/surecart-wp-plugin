import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

const blockStyle = {
	backgroundColor: '#900',
	color: '#fff',
	padding: '20px',
};

registerBlockType( 'checkout-engine/checkout-form', {
	title: __( 'Checkout Engine Form', 'checkout_engine' ),
	icon: 'universal-access-alt',
	category: 'layout',
	example: {},
	edit() {
		return (
			<div style={ blockStyle }>
				Hello World, step 1 (from the editor).
			</div>
		);
	},
	save() {
		return (
			<div style={ blockStyle }>
				Hello World, step 1 (from the frontend).
			</div>
		);
	},
} );
