/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		// allowedBlocks: ['surecart/product-page'],
		// template: [
		// 	[
		// 	],
		// ],
	});

	return <div {...innerBlocksProps}></div>;
};
