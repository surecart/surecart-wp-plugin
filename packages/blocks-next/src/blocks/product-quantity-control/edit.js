/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __experimentalGetElementClassName } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-quantity-input-decrease',
			'surecart/product-quantity-input',
			'surecart/product-quantity-input-increase',
		],
		template: [
			['surecart/product-quantity-input-decrease', {}],
			['surecart/product-quantity-input', {}],
			['surecart/product-quantity-input-increase', {}],
		],
		templateLock: false,
	});

	return <div {...innerBlocksProps} />;
};
