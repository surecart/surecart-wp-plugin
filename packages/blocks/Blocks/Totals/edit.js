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
import { CeOrderSummary } from '@surecart/components-react';

const ALLOWED_BLOCKS = [
	'surecart/coupon',
	'surecart/divider',
	'surecart/line-items',
	'surecart/tax-line-item',
	'surecart/total',
	'surecart/subtotal',
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
				['surecart/divider', {}],
				['surecart/line-items', {}],
				['surecart/divider', {}],
				[
					'surecart/subtotal',
					{
						text: __('Subtotal', 'surecart'),
					},
				],
				[
					'surecart/coupon',
					{
						text: __('Add Coupon Code', 'surecart'),
						button_text: __('Apply Coupon', 'surecart'),
					},
				],
				['surecart/tax-line-item', {}],
				['surecart/divider', {}],
				[
					'surecart/total',
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
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Collapsible', 'surecart')}
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
							label={__('Collapsed By Default', 'surecart')}
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
