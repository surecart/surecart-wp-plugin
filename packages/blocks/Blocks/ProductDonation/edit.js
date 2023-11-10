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
import { productDonationStore } from '@surecart/components';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
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

const TEMPLATE = [['surecart/product-donation-amounts']];

export default ({ attributes, setAttributes }) => {
	const [query, setQuery] = useState(null);

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

	const { product_id } = attributes;

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps();

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: [
			'surecart/product-donation-amounts',
			'surecart/product-donation-prices',
		],
		renderAppender: InnerBlocks.ButtonBlockAppender,
		template: TEMPLATE,
	});

	const product = useSelect(
		(select) => {
			return select(coreStore).getEntityRecord(
				'surecart',
				'product',
				product_id,
				{ expand: ['prices'] }
			);
		},
		[product_id]
	);
	console.log({ product });
	productDonationStore.state[product_id] = {
		product,
		amounts: product?.prices?.data.map((price) => price?.amount),
		ad_hoc_amount: product?.prices?.data[0]?.amount,
		selectedPrice: product?.prices?.data[0],
	};

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
		<div {...innerBlocksProps}>
			{/* <ScProductDonationChoices
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
				</ScProductDonationChoices> */}
		</div>
	);
};
