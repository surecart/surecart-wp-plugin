import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { showAllBundleItems } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Bundle items', 'surecart')}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Show all bundle items', 'surecart')}
							help={__(
								'List every product included in a bundle. When off, only items with a selected variant are shown.',
								'surecart'
							)}
							checked={showAllBundleItems}
							onChange={(showAllBundleItems) =>
								setAttributes({ showAllBundleItems })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-cart-line-item-variant__option">
					{__('Small / Red', 'surecart')}
				</div>
			</div>
		</>
	);
};
