/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import SelectProduct from '@scripts/blocks/components/SelectProduct';

import { ScProductDonationChoices } from '@surecart/components-react';

const TEMPLATE = [
	['surecart/product-donation-amount', { amount: 100, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 200, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 500, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 1000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 2000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 5000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 10000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 20000, currency: 'USD' }],
	['surecart/product-donation-amount', { amount: 50000, currency: 'USD' }],
	['surecart/custom-donation-amount', { currency: 'USD' }],
];

export default ({ attributes, setAttributes }) => {
	const {
		product_id,
		amount_label,
		amount_columns,
		recurring_label,
		currency,
		recurring_choice_label,
		non_recurring_choice_label,
	} = attributes;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps({
		style: {
			display: 'grid',
			position: 'relative',
			zIndex: 1,
		},
		css: css`
			sc-choice.wp-block {
				margin: 0;
			}
		`,
	});

	const { children, innerBlocksProps } = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['surecart/product-donation-amount'],
			renderAppender: InnerBlocks.ButtonBlockAppender,
			orientation: 'horizontal',
			TEMPLATE,
		}
	);

	if (!product_id) {
		return (
			<div {...blockProps}>
				<SelectProduct
					onSelect={(product_id) => setAttributes({ product_id })}
					onlyShowProducts={true}
					onlyShowAdHocProducts={true}
				/>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Amount Title', 'surecart')}
							value={amount_label}
							onChange={(amount_label) =>
								setAttributes({ amount_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Recurring Title', 'surecart')}
							value={recurring_label}
							onChange={(recurring_label) =>
								setAttributes({ recurring_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Recurring Choice Title', 'surecart')}
							value={recurring_choice_label}
							onChange={(recurring_choice_label) =>
								setAttributes({ recurring_choice_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Non Recurring Choice Title', 'surecart')}
							value={non_recurring_choice_label}
							onChange={(non_recurring_choice_label) =>
								setAttributes({ non_recurring_choice_label })
							}
						/>
					</PanelRow>
					<NumberControl
						label={__('Amount Columns', 'surecart')}
						value={amount_columns}
						min={1}
						onChange={(amount_columns) =>
							setAttributes({
								amount_columns: parseInt(amount_columns),
							})
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div {...innerBlocksProps}>
					<ScProductDonationChoices
						amountLabel={amount_label}
						recurringLabel={recurring_label}
						recurringChoiceLabel={recurring_choice_label}
						nonRecurringChoiceLabel={non_recurring_choice_label}
						amountColumns={amount_columns}
						productId={product_id}
						style={{
							border: 'none',
							'--sc-input-required-indicator': '/\\00a0',
							'--sc-choice-text-color': colorProps?.style?.color,
							'--sc-choice-background-color':
								colorProps?.style?.backgroundColor,
							'--sc-choice-border-color':
								borderProps?.style?.borderColor,
							'--sc-choice-border-width':
								borderProps?.style?.borderWidth,
							'--sc-choice-border-radius':
								borderProps?.style?.borderRadius,
							'--sc-choice-padding-left':
								spacingProps?.style?.paddingLeft,
							'--sc-choice-padding-right':
								spacingProps?.style?.paddingRight,
							'--sc-choice-padding-top':
								spacingProps?.style?.paddingTop,
							'--sc-choice-padding-bottom':
								spacingProps?.style?.paddingBottom,
							marginTop: spacingProps?.style?.marginTop,
							marginLeft: spacingProps?.style?.marginLeft,
							marginRight: spacingProps?.style?.marginRight,
							marginBottom: spacingProps?.style?.marginBottom,
						}}
					>
						{children}
					</ScProductDonationChoices>
				</div>
			</div>
		</>
	);
};
