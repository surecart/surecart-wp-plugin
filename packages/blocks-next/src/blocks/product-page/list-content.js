import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import template from './template';

export default function ProductPageEdit() {
	const blockProps = useBlockProps({
		className: 'sc-product-page__editor-container',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return <div {...innerBlocksProps} />;
}
