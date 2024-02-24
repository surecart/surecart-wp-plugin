import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-product-page__editor-container',
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return <div {...innerBlocksProps} />;
};
