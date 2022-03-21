/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { CeOrderSummary } from '@checkout-engine/components-react';

const ALLOWED_BLOCKS = [
	'checkout-engine/coupon',
	'checkout-engine/divider',
	'checkout-engine/line-items',
	'checkout-engine/tax-line-item',
	'checkout-engine/total',
	'checkout-engine/subtotal',
];

export default ({ isSelected, attributes, setAttributes }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const { collapsible, collapsed } = attributes;

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			template: [
				['checkout-engine/divider', {}],
				['checkout-engine/line-items', {}],
				['checkout-engine/divider', {}],
				[
					'checkout-engine/subtotal',
					{
						text: __('Subtotal', 'surecart'),
					},
				],
				[
					'checkout-engine/coupon',
					{
						text: __('Add Coupon Code', 'surecart'),
						button_text: __('Apply Coupon', 'surecart'),
					},
				],
				['checkout-engine/tax-line-item', {}],
				['checkout-engine/divider', {}],
				[
					'checkout-engine/total',
					{
						text: __('Total', 'surecart'),
						subscription_text: __('Total Due Today', 'surecart'),
					},
				],
			],
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<ToggleControl
							label={__('Collapsible', 'checkout-engine')}
							checked={collapsible}
							onChange={(collapsible) => {
								setAttributes({ collapsible });
								if (!collapsible) {
									setAttributes({ collapsed: false });
								}
							}}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__(
								'Collapsed By Default',
								'checkout-engine'
							)}
							checked={collapsed}
							onChange={(collapsed) => {
								setAttributes({ collapsed });
								if (collapsed) {
									setAttributes({ collapsible: true });
								}
							}}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeOrderSummary
				collapsible={collapsible}
				collapsed={collapsed}
				{...innerBlocksProps}
			></CeOrderSummary>
		</Fragment>
	);
};
