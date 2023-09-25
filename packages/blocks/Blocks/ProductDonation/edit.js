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
} from '@wordpress/block-editor';
import SelectProduct from '@scripts/blocks/components/SelectProduct';

import {
	ScProductDonationChoices,
} from '@surecart/components-react';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const { product_id, amount_label, amount_columns, recurring_label, currency, recurring_choice_label, non_recurring_choice_label } =
		attributes;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const template= [
		['surecart/product-donation-amount', { amount: 100, currency }],
		['surecart/product-donation-amount', { amount: 200, currency }],
		['surecart/product-donation-amount', { amount: 500, currency }],
		['surecart/product-donation-amount', { amount: 1000, currency }],
		['surecart/product-donation-amount', { amount: 2000, currency }],
		['surecart/product-donation-amount', { amount: 5000, currency }],
		['surecart/product-donation-amount', { amount: 10000, currency }],
		['surecart/product-donation-amount', { amount: 20000, currency }],
		['surecart/product-donation-amount', { amount: 50000, currency }],
		['surecart/custom-donation-amount', { currency }],
	];

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

	const {children,innerBlocksProps} = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['surecart/product-donation-amount'],
			renderAppender: InnerBlocks.ButtonBlockAppender,
			orientation: 'horizontal',
			template,
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
							onChange={(amount_label) => setAttributes({ amount_label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Recurring Title', 'surecart')}
							value={recurring_label}
							onChange={(recurring_label) => setAttributes({ recurring_label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Recurring Choice Title', 'surecart')}
							value={recurring_choice_label}
							onChange={(recurring_choice_label) => setAttributes({ recurring_choice_label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Non Recurring Choice Title', 'surecart')}
							value={non_recurring_choice_label}
							onChange={(non_recurring_choice_label) => setAttributes({ non_recurring_choice_label })}
						/>
					</PanelRow>
					<NumberControl
						label={__('Amount Columns', 'surecart')}
						value={amount_columns}
						min={1}
						onChange={(amount_columns) => setAttributes({ amount_columns: parseInt(amount_columns) })}
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
						product={product_id}
					>
						{children}
					</ScProductDonationChoices>
				</div>
			</div>
		</>
	);
};
