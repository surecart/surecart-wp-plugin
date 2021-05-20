import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit.js';

const blockStyle = {
	backgroundColor: '#900',
	color: '#fff',
	padding: '20px',
};

registerBlockType( 'checkout-engine/button', {
	title: __( 'Button', 'checkout_engine' ),
	icon: 'star',
	// parent: [ 'checkout-engine/checkout-form' ],
	category: 'design',
	example: {},
	edit,
	save() {
		return (
			<div style={ blockStyle }>
				Hello World, step 1 (from the frontend).
			</div>
		);
	},
} );
