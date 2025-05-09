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
	'surecart/trial-line-item',
	'surecart/total',
	'surecart/bump-line-item',
	'surecart/subtotal',
	'surecart/line-item-shipping',
	'surecart/invoice-details',
	'surecart/conditional-form',
];

export default ({ attributes, setAttributes }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const {
		collapsible,
		collapsedOnDesktop,
		order_summary_text,
		invoice_summary_text,
		collapsedOnMobile,
	} = attributes;

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
				['surecart/trial-line-item', {}],
				[
					'surecart/coupon',
					{
						text: __('Add Coupon Code', 'surecart'),
						button_text: __('Apply Coupon', 'surecart'),
					},
				],
				['surecart/line-item-shipping', {}],
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
									setAttributes({
										collapsed: false,
										collapsedOnMobile: false,
									});
								}
							}}
						/>
					</PanelRow>
					{collapsible ? (
						<Fragment>
							<PanelRow>
								<ToggleControl
									label={__(
										'Collapsed On Desktop',
										'surecart'
									)}
									checked={collapsedOnDesktop}
									onChange={(collapsedOnDesktop) => {
										setAttributes({ collapsedOnDesktop });
										if (collapsedOnDesktop) {
											setAttributes({
												collapsible: true,
											});
										}
									}}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__(
										'Collapsed On Mobile',
										'surecart'
									)}
									checked={collapsedOnMobile}
									onChange={(collapsedOnMobile) => {
										setAttributes({ collapsedOnMobile });
										if (collapsedOnMobile) {
											setAttributes({
												collapsible: true,
											});
										}
									}}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Order Summary Text', 'surecart')}
									value={order_summary_text}
									onChange={(order_summary_text) =>
										setAttributes({ order_summary_text })
									}
									placeholder={__('Summary', 'surecart')}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__(
										'Invoice Summary Text',
										'surecart'
									)}
									value={invoice_summary_text}
									onChange={(invoice_summary_text) =>
										setAttributes({ invoice_summary_text })
									}
									help={__(
										'Displayed on the summary when this is an invoice.',
										'surecart'
									)}
									placeholder={__(
										'Invoice Summary',
										'surecart'
									)}
								/>
							</PanelRow>
						</Fragment>
					) : null}
				</PanelBody>
			</InspectorControls>

			<ScOrderSummary
				collapsible={collapsible}
				collapsedOnDesktop={collapsedOnDesktop}
				orderSummaryText={order_summary_text || null}
				invoiceSummaryText={invoice_summary_text || null}
				collapsedOnMobile={collapsedOnMobile}
				{...innerBlocksProps}
			></ScOrderSummary>
		</Fragment>
	);
};
