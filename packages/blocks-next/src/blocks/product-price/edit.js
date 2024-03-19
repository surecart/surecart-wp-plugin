import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default ({
	attributes: { range },
	setAttributes,
	context: { 'surecart/productId': productId },
}) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const product = useSelect(
		(select) => {
			if (!productId) {
				return null;
			}
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				productId
			);
		},
		[productId]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Options', 'surecart')}>
					<ToggleControl
						label={__('Price Range', 'surecart')}
						help={__(
							'Show a range of prices if multiple prices are available or has variable products.',
							'surecart'
						)}
						checked={range}
						onChange={(range) => setAttributes({ range })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{product?.id
					? range
						? product?.range_display_amount
						: product?.display_amount
					: '$10'}
			</div>
		</>
	);
};
