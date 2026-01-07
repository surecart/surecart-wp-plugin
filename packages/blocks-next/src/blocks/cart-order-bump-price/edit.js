/**
 * External dependencies.
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		className: 'sc-cart-order-bump-price',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<ToggleControl
						label={__('Show Original Price', 'surecart')}
						checked={attributes.showOriginalPrice}
						onChange={(showOriginalPrice) =>
							setAttributes({ showOriginalPrice })
						}
					/>
					<ToggleControl
						label={__('Show Discount Badge', 'surecart')}
						checked={attributes.showDiscountBadge}
						onChange={(showDiscountBadge) =>
							setAttributes({ showDiscountBadge })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{attributes.showOriginalPrice && (
					<span className="sc-cart-order-bump-price__original">
						$30
					</span>
				)}
				<span className="sc-cart-order-bump-price__current">$27</span>
				{attributes.showDiscountBadge && (
					<span className="sc-cart-order-bump-price__badge">
						-10%
					</span>
				)}
			</div>
		</>
	);
};
