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
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { ScOrderSummary } from '@surecart/components-react';

const ALLOWED_BLOCKS = [
	'surecart/coupon',
	'surecart/divider',
	'surecart/line-items',
	'surecart/tax-line-item',
	'surecart/total',
	'surecart/bump-line-item',
	'surecart/subtotal',
];

export default ({ attributes, setAttributes }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const { collapsible, collapsed, closed_text, open_text } = attributes;

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
					<PanelRow>
						<TextControl
							label={__('Closed Text', 'surecart')}
							value={closed_text}
							onChange={(closed_text) =>
								setAttributes({ closed_text })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Open Text', 'surecart')}
							value={open_text}
							onChange={(open_text) =>
								setAttributes({ open_text })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScOrderSummary
				collapsible={collapsible}
				collapsed={collapsed}
				closedText={closed_text}
				openText={open_text}
				{...innerBlocksProps}
			></ScOrderSummary>
		</Fragment>
	);
};
