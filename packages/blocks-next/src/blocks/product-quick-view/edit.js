/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({
	attributes: { showViewProductPageStickyFooter },
	setAttributes,
}) => {
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
						name: 'Product Quick View',
					},
					align: 'wide',
					layout: { type: 'constrained' },
				},
			],
		],
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__(
							'Show view product page sticky footer.',
							'surecart'
						)}
						checked={showViewProductPageStickyFooter}
						onChange={(showViewProductPageStickyFooter) =>
							setAttributes({ showViewProductPageStickyFooter })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...innerBlocksProps}></div>
		</>
	);
};
