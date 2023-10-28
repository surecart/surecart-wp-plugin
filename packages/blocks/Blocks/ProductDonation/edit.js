/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	__experimentalNumberControl as NumberControl,
	Placeholder,
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
import SelectModel from '../../../admin/components/SelectModel';

import {
	ScProductDonationChoices,
	ScButton,
	ScIcon,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

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

export default ({ attributes, setAttributes, clientId }) => {
	const [query, setQuery] = useState(null);

	// there has not yet been an instance id.
	if (!attributes?.id) {
		setAttributes({ id: clientId });
	}

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					query,
					archived: false,
					ad_hoc: true,
					expand: ['prices'],
				},
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

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

	const { children, innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-donation-amount',
			'surecart/custom-donation-amount',
		],
		renderAppender: InnerBlocks.ButtonBlockAppender,
		orientation: 'horizontal',
		template: TEMPLATE,
	});

	if (!product_id) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							style={{ fill: 'none' }}
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
							<circle cx="12" cy="12" r="3"></circle>
						</svg>
					}
					label={__('Select a Product', 'surecart')}
					instructions={__(
						'Select a product to display donation choices according to the prices of the product.',
						'surecart'
					)}
				>
					<SelectModel
						choices={(products || []).map((product) => ({
							label: product.name,
							value: product.id,
						}))}
						onQuery={setQuery}
						onFetch={() => setQuery('')}
						loading={loading}
						onSelect={(product_id) => setAttributes({ product_id })}
						style={{ width: '100%' }}
					>
						<ScButton slot="trigger" type="primary">
							<ScIcon name="plus" slot="prefix" />
							{__('Select Product', 'surecart')}
						</ScButton>
					</SelectModel>
				</Placeholder>
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
		</>
	);
};
