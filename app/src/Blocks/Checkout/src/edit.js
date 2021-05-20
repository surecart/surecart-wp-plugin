import { InnerBlocks } from '@wordpress/block-editor';

export const ALLOWED_BLOCKS = [ 'checkout-engine/button', 'core/paragraph' ];
export const TEMPLATE = [
	[ 'checkout-engine/button', { placeholder: 'test' } ],
];

export default ( { className } ) => {
	return (
		<div className={ className }>
			<InnerBlocks
				renderAppender={ InnerBlocks.ButtonBlockAppender }
				template={ TEMPLATE }
				allowedBlocks={ ALLOWED_BLOCKS }
			/>
		</div>
	);
};
