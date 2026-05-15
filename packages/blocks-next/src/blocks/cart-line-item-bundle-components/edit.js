import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { showSingleQuantity = true } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-cart-line-item-bundle-components',
	});

	const previewItems = [
		{ label: __('Mens Watch — Black / Leather', 'surecart'), qty: 2 },
		{ label: __('Mens Sunglass', 'surecart'), qty: 1 },
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Quantity display', 'surecart')}>
					<ToggleControl
						label={__('Show for single items', 'surecart')}
						help={__(
							'When off, "× 1" is hidden so only components with a higher quantity show the multiplier.',
							'surecart'
						)}
						checked={showSingleQuantity}
						onChange={(value) =>
							setAttributes({ showSingleQuantity: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{previewItems.map(({ label, qty }) => {
					const showQty = qty > 1 || showSingleQuantity;
					return (
						<div
							key={label}
							className="sc-cart-line-item-bundle-components__item"
						>
							<span className="sc-cart-line-item-bundle-components__label">
								{label}
							</span>
							{showQty && (
								<span className="sc-cart-line-item-bundle-components__qty">
									× {qty}
								</span>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};
