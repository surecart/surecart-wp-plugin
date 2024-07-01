import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default ({
	attributes: { show_range },
	setAttributes,
	context: { 'surecart/productId': productId },
}) => {
	const blockProps = useBlockProps({
		className: 'product-price',
	});

	const {
		record: {
			meta: { product },
		},
	} = useEntityRecord('postType', 'sc_product', productId);

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
						checked={show_range}
						onChange={(show_range) => setAttributes({ show_range })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{product?.id
					? show_range
						? product?.range_display_amount
						: product?.display_amount
					: '$10'}
			</div>
		</>
	);
};
