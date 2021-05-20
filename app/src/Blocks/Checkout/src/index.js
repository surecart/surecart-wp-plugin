import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import edit from './edit';

registerBlockType( 'checkout-engine/checkout-form', {
	title: __( 'Checkout Engine Form', 'checkout_engine' ),
	icon: 'cart',
	category: 'design',
	example: {},
	edit,
	save() {
		return (
			<div>
				<presto-checkout>
					<InnerBlocks.Content />
				</presto-checkout>
			</div>
		);
	},
} );
