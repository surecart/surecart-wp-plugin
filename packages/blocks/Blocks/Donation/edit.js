/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprinf } from '@wordpress/i18n';
import { Fragment, useState, useRef } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
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
import {
	CeButton,
	CeDonationChoices,
	CeForm,
	CePriceInput,
} from '@checkout-engine/components-react';
import { store as coreStore } from '@wordpress/core-data';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const [showModal, setShowModal] = useState(false);
	const { insertBlocks } = useDispatch(blockEditorStore);
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const { price_id, label, currency } = attributes;
	const [template, setTemplate] = useState([
		['checkout-engine/donation-amount', { amount: 100, currency }],
		['checkout-engine/donation-amount', { amount: 200, currency }],
		['checkout-engine/donation-amount', { amount: 500, currency }],
		['checkout-engine/donation-amount', { amount: 1000, currency }],
		['checkout-engine/donation-amount', { amount: 2000, currency }],
		['checkout-engine/donation-amount', { amount: 5000, currency }],
		['checkout-engine/donation-amount', { amount: 10000, currency }],
		['checkout-engine/donation-amount', { amount: 20000, currency }],
		['checkout-engine/donation-amount', { amount: 50000, currency }],
	]);

	const price = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'price', price_id),
		[price_id]
	);

	const amountInput = useRef();

	const blockProps = useBlockProps({
		style: {
			display: 'grid',
		},
		css: css`
			ce-choice.wp-block {
				margin: 0;
			}
		`,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ['checkout-engine/donation-amount'],
			renderAppender: false,
			orientation: 'horizontal',
			template,
		}
	);

	const onNewAmount = async (e) => {
		e.preventDefault();
		const { amount } = await e.target.getFormJson();

		insertBlocks(
			createBlocksFromInnerBlocksTemplate([
				['checkout-engine/donation-amount', { amount, currency }],
			]),
			999999,
			clientId
		);
		setShowModal(false);
	};

	const priceSelected = async (price_id) => {
		const price = await select(coreStore).getEntityRecord(
			'root',
			'price',
			price_id
		);

		// need a price.
		if (!price) return;

		// get max and min amounts.
		const { ad_hoc_max_amount, ad_hoc_min_amount } = price;

		// if we don't have any, we can set the default.
		if (!ad_hoc_max_amount && !ad_hoc_min_amount) {
			return setAttributes({ price_id });
		}

		// filter blocks who are only inside the range.
		setTemplate(
			template.filter(
				(block) =>
					block[1].amount <= ad_hoc_max_amount &&
					block[1].amount >= ad_hoc_min_amount
			)
		);
		return setAttributes({ price_id });
	};

	if (!price_id) {
		return (
			<div {...blockProps}>
				<PriceSelector onSelect={priceSelected} ad_hoc={true} />
			</div>
		);
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'checkout-engine')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<CeDonationChoices label={label} priceId={price_id}>
					<div {...innerBlocksProps}></div>
					<ce-choice show-control="false" size="small" value="ad_hoc">
						{__('Other', 'checkout_engine')}
					</ce-choice>
				</CeDonationChoices>

				{isSelected && (
					<Tooltip
						text={__('Add Amount', 'checkout_engine')}
						delay={0}
					>
						<div
							onClick={() => {
								setShowModal(true);
								setTimeout(() => {
									amountInput.current.triggerFocus();
								}, 50);
							}}
							css={css`
								border: 1px solid #1e1e1e;
								color: #1e1e1e;
								padding: 6px 12px;
								display: flex;
								align-items: center;
								justify-content: center;
								line-height: 0;
								cursor: pointer;
								position: relative;
								margin: 10px;
								font-size: 16px;

								&:hover {
									border-color: var(--wp-admin-theme-color);
								}
							`}
						>
							<ce-icon name="plus"></ce-icon>
						</div>
					</Tooltip>
				)}

				{showModal && (
					<Modal
						title={__(
							'Add Suggested Donation Amount',
							'checkout_engine'
						)}
						css={css`
							max-width: 500px !important;
						`}
						onRequestClose={() => setShowModal(false)}
						shouldCloseOnClickOutside={false}
					>
						<CeForm onCeSubmit={onNewAmount}>
							<CePriceInput
								label={__('Amount', 'checkout_engine')}
								required
								currency={currency}
								ref={amountInput}
								min={price?.ad_hoc_min_amount}
								max={price?.ad_hoc_max_amount}
								name="amount"
							/>
							<CeButton type="primary" submit>
								{__('Add  Amount', 'checkout_engine')}
							</CeButton>
						</CeForm>
					</Modal>
				)}
			</div>
		</Fragment>
	);
};
