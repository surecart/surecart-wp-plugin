/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { label, type, columns, required } = attributes;
	return (
		<ce-price-choices label={ label } type={ type } columns={ columns }>
			<div>
				<InnerBlocks.Content />
			</div>
		</ce-price-choices>
	);
};
