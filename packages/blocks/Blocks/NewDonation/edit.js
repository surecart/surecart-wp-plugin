/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useRef, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Modal,
	Tooltip,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { select, useDispatch, useSelect } from '@wordpress/data';
import PriceSelector from '@scripts/blocks/components/PriceSelector';
import SelectProduct from '@scripts/blocks/components/SelectProduct';

import {
	ScButton,
	ScDonationChoices,
	ScForm,
	ScPriceInput,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import PriceInfo from '@scripts/blocks/components/PriceInfo';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const { product_id, label, currency, custom_amount, default_amount } =
		attributes;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const [template, setTemplate] = useState([
		['surecart/donation-amount', { amount: 100, currency }],
		['surecart/donation-amount', { amount: 200, currency }],
		['surecart/donation-amount', { amount: 500, currency }],
		['surecart/donation-amount', { amount: 1000, currency }],
		['surecart/donation-amount', { amount: 2000, currency }],
		['surecart/donation-amount', { amount: 5000, currency }],
		['surecart/donation-amount', { amount: 10000, currency }],
		['surecart/donation-amount', { amount: 20000, currency }],
		['surecart/donation-amount', { amount: 50000, currency }],
	]);

	const product = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'product', product_id),
		[product_id]
	);

	const blockProps = useBlockProps({
		style: {
			display: 'grid',
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
			allowedBlocks: ['surecart/donation-amount'],
			renderAppender: false,
			orientation: 'horizontal',
			template,
		}
	);

	const productSelected = async (product_id) => {
		const product = await select(coreStore).getEntityRecord(
			'root',
			'product',
			product_id
		);
		// need a price.
		if (!product) return;

		return setAttributes({ product_id });
	};

	if (!product_id) {
		return (
			<div {...blockProps}>
				<SelectProduct onSelect={productSelected} onlyShowProducts={true} />
			</div>
		);
	}

	return (
		<Fragment>
			<div {...blockProps}>
				<ScDonationChoices
					label={label}
					priceId={product_id}
					defaultAmount={default_amount}
				>
					<div {...innerBlocksProps}></div>
				</ScDonationChoices>
			</div>
		</Fragment>
	);
};
