/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
export default () => {
	const blockProps = useBlockProps({});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['surecart/product-page'],
		template: [
			[
				'surecart/product-page',
				{
					metadata: {
						categories: ['surecart_product_page'],
						patternName: 'surecart-product-quick-view',
						name: __('Product Quick View', 'surecart'),
					},
					align: 'wide',
					layout: { type: 'constrained' },
				},
			],
		],
	});

	return <div {...innerBlocksProps}></div>;
};
