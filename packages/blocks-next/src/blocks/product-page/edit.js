import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { product_id } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-product-page__editor-container',
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<>
			<InspectorControls>
				<TextControl
					label="ID"
					value={product_id}
					onChange={(product_id) => setAttributes({ product_id })}
				/>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
};
