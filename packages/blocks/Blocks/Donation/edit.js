/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprinf } from '@wordpress/i18n';
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
import {
	ScButton,
	ScDonationChoices,
	ScForm,
	ScPriceInput,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import PriceInfo from '../PriceChoice/components/PriceInfo';

export default ({ attributes, setAttributes, isSelected, clientId }) => {
	const { price_id, label, currency, custom_amount, default_amount } =
		attributes;

	const [showModal, setShowModal] = useState(false);
	const { insertBlocks, updateBlockAttributes } =
		useDispatch(blockEditorStore);
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

	const price = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'price', price_id),
		[price_id]
	);

	const children = useSelect(
		(select) =>
			select(blockEditorStore).getBlocksByClientId(clientId)?.[0]
				.innerBlocks
	);

	useEffect(() => {
		if (!children.length) {
			return;
		}
		children.forEach(function (child) {
			updateBlockAttributes(child.clientId, {
				currency: price?.currency,
			});
		});
	}, [price?.currency, children]);

	const amountInput = useRef();

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

	const onNewAmount = async (e) => {
		e.preventDefault();
		const { amount } = await e.target.getFormJson();

		insertBlocks(
			createBlocksFromInnerBlocksTemplate([
				['surecart/donation-amount', { amount, currency }],
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
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__(
								'Allow custom amount to be entered',
								'surecart'
							)}
							checked={custom_amount}
							onChange={(custom_amount) =>
								setAttributes({ custom_amount })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ScPriceInput
							label={__('Default Amount', 'surecart')}
							currencyCode={price?.currency}
							value={default_amount}
							onScChange={(e) =>
								setAttributes({
									default_amount: e.target.value,
								})
							}
						></ScPriceInput>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Product Info', 'surecart')}>
					<PriceInfo price_id={price_id} />
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScDonationChoices
					label={label}
					priceId={price_id}
					defaultAmount={default_amount}
				>
					<div {...innerBlocksProps}></div>
					{custom_amount && (
						<sc-choice
							show-control="false"
							size="small"
							value="ad_hoc"
						>
							{__('Other', 'surecart')}
						</sc-choice>
					)}
				</ScDonationChoices>

				{isSelected && (
					<Tooltip text={__('Add Amount', 'surecart')} delay={0}>
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
							<sc-icon name="plus"></sc-icon>
						</div>
					</Tooltip>
				)}

				{showModal && (
					<Modal
						title={__('Add Suggested Donation Amount', 'surecart')}
						css={css`
							max-width: 500px !important;
						`}
						onRequestClose={() => setShowModal(false)}
						shouldCloseOnClickOutside={false}
					>
						<ScForm onScSubmit={onNewAmount}>
							<ScPriceInput
								label={__('Amount', 'surecart')}
								required
								currencyCode={price?.currency}
								ref={amountInput}
								min={price?.ad_hoc_min_amount}
								max={price?.ad_hoc_max_amount}
								name="amount"
							/>
							<ScButton type="primary" submit>
								{__('Add  Amount', 'surecart')}
							</ScButton>
						</ScForm>
					</Modal>
				)}
			</div>
		</Fragment>
	);
};
