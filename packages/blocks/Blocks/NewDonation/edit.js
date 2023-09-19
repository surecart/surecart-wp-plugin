/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import SelectProduct from '@scripts/blocks/components/SelectProduct';

import {
	ScDonationChoicesNew,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const { product_id, amount_label, amount_columns, recurring_label, currency, default_amount } =
		attributes;

	const product = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'product', product_id, { expand: ['prices'], archived: false }),
		[product_id]
	);
	
	const prices = product?.prices?.data;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const [template, setTemplate] = useState([
		['surecart/new-donation-amount', { amount: 100, currency }],
		['surecart/new-donation-amount', { amount: 200, currency }],
		['surecart/new-donation-amount', { amount: 500, currency }],
		['surecart/new-donation-amount', { amount: 1000, currency }],
		['surecart/new-donation-amount', { amount: 2000, currency }],
		['surecart/new-donation-amount', { amount: 5000, currency }],
		['surecart/new-donation-amount', { amount: 10000, currency }],
		['surecart/new-donation-amount', { amount: 20000, currency }],
		['surecart/new-donation-amount', { amount: 50000, currency }],
	]);

	const [templateVerified, setTemplateVerified] = useState(false);

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

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['surecart/new-donation-amount'],
			renderAppender: false,
			orientation: 'horizontal',
			template,
		}
	);

	useEffect(() => {
		let minimum;
		let maximum;
		
		if(!prices?.length) {
			return;
		}
		
		prices?.forEach((price) => {
			//get a minimum ad hoc amount & maximum ad hoc amount. minimum should be the lowest amount, maximum should be the highest amount in all prices.
			const { ad_hoc_max_amount, ad_hoc_min_amount } = price;
			// if we don't have any, we can set the default.
			if (!ad_hoc_max_amount && !ad_hoc_min_amount) {
				return;
			}
			if (!minimum || ad_hoc_min_amount < minimum) {
				minimum = ad_hoc_min_amount;
			}
			if (!maximum || ad_hoc_max_amount > maximum) {
				maximum = ad_hoc_max_amount;
			}

		});
		// filter blocks who are only inside the range.
		setTemplate(
			template.filter(
				(block) =>
					block[1].amount <= maximum &&
					block[1].amount >= minimum
			)
		);

		setTemplateVerified(true);
	}, [product, product_id]);

	if (!product_id || !product || !templateVerified) {
		return (
			<div {...blockProps}>
				<SelectProduct onSelect={(product_id) => setAttributes({ product_id })} onlyShowProducts={true} />
			</div>
		);
	}
console.log(recurring_label);
	return (
		<Fragment>
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
							label={__('Recurring Choice Title', 'surecart')}
							value={recurring_label}
							onChange={(recurring_label) => setAttributes({ recurring_label })}
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
				<ScDonationChoicesNew
					amountlabel={amount_label}
					recurringlabel={recurring_label}
					amountcolumns={amount_columns}
					product={product_id}
					defaultAmount={default_amount}
				>
					<div {...innerBlocksProps}></div>
				</ScDonationChoicesNew>
			</div>
		</Fragment>
	);
};
