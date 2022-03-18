/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { CeCheckout } from '@checkout-engine/components-react';
import { Fragment, useState } from '@wordpress/element';
import { parse } from '@wordpress/blocks';
import {
	PanelRow,
	PanelBody,
	Button,
	SelectControl,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import Cart from './components/Cart';
import Mode from './components/Mode';
import Setup from './components/Setup';

const ALLOWED_BLOCKS = [
	'core/spacer',
	'checkout-engine/columns',
	'checkout-engine/input',
	'checkout-engine/password',
	'checkout-engine/price-selector',
	'checkout-engine/checkbox',
	'checkout-engine/divider',
	'checkout-engine/heading',
	'checkout-engine/button',
	'checkout-engine/email',
	'checkout-engine/switch',
	'checkout-engine/name',
	'checkout-engine/payment',
	'checkout-engine/express-payment',
	'checkout-engine/pricing-section',
	'checkout-engine/totals',
	'checkout-engine/form',
	'checkout-engine/section-title',
	'checkout-engine/submit',
];

export default function edit({ clientId, attributes, setAttributes }) {
	const UnitControl = __stableUnitControl
		? __stableUnitControl
		: __experimentalUnitControl;

	const { align, className, prices, font_size, choice_type, mode, gap } =
		attributes;
	const [tab, setTab] = useState('');
	const blockCount = useSelect((select) =>
		select(blockEditorStore).getBlockCount(clientId)
	);
	const [template, setTemplate] = useState('sections');
	const { replaceInnerBlocks, setTemplateValidity } =
		useDispatch(blockEditorStore);

	// temporary fix for default template.
	setTemplateValidity(true);

	const changeTemplate = async () => {
		const r = confirm(
			__(
				'Are you sure you want to change the template? This will completely replace your current form.',
				'checkout-engine'
			)
		);
		if (!r) return;
		replaceInnerBlocks(clientId, [], false);
	};

	const formId = useSelect((select) => {
		// parent block id attribute.
		const parents = select(blockEditorStore).getBlockParents(clientId);
		const parentBlock = select(blockEditorStore).getBlocksByClientId(
			parents?.[0]
		);
		// current post id.
		const post_id = select('core/editor').getCurrentPostId();
		return parentBlock?.[0]?.attributes?.id || post_id;
	});

	/**
	 * Maybe create the template for the form.
	 */
	const maybeCreateTemplate = async ({
		template = 'default',
		choices,
		choice_type,
	}) => {
		const result = await apiFetch({
			url: ceData.plugin_url + '/templates/forms/' + template + '.html',
			parse: false,
			cache: 'no-cache',
		});

		// parse blocks.
		const parsed = parse(await result.text());

		// get the price selector block
		const priceChoiceBlock = parsed.findIndex(
			(block) => block.name === 'checkout-engine/price-selector'
		);

		// Remove price choices from template.
		if (!choices?.length || !['checkbox', 'radio'].includes(choice_type)) {
			return parsed.filter(function (_, index) {
				return index !== priceChoiceBlock;
			});
		}

		// add choices as price choice inner blocks.
		parsed[priceChoiceBlock].innerBlocks = choices.map((choice, index) => {
			return [
				'checkout-engine/price-choice',
				{
					price_id: choice?.id,
					quantity: choice?.quantity || 1,
					type: choice_type,
					checked: index === 0 && choice_type === 'radio',
				},
			];
		});

		return parsed;
	};

	const onCreate = async ({
		choices,
		choice_type,
		template,
		custom_success_url,
		success_url,
	}) => {
		// form attributes.
		setAttributes({
			prices: choice_type === 'all' ? choices : [],
			redirect: custom_success_url && success_url ? success_url : '',
		});

		const result = await maybeCreateTemplate({
			template,
			choices,
			choice_type,
		});

		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(result),
			false
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Form Template', 'checkout_engine')}>
					<PanelRow>
						<div>
							<Button isPrimary onClick={changeTemplate}>
								{__('Change Template', 'checkout_engine')}
							</Button>
						</div>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Dimensions', 'checkout_engine')}>
					<PanelRow>
						<UnitControl
							label={__('Row Gap')}
							onChange={(gap) => setAttributes({ gap })}
							value={gap}
							help={__(
								'The this is the space between the rows of form elements.',
								'checkout_engine'
							)}
							units={[
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{blockCount === 0 ? (
				<Setup onCreate={onCreate} clientId={clientId} />
			) : (
				<div
					css={css`
						max-width: var(--ast-content-width-size);
						margin-left: auto !important;
						margin-right: auto !important;
					`}
				>
					<div
						css={css`
							padding: 10px 16px;
							border-radius: 8px;
							display: grid;
							gap: 0.5em;
							border: 1px solid transparent;
							background: var(--ce-color-gray-100, #f9fafb);
						`}
					>
						<div
							css={css`
								display: flex;
								justify-content: space-between;
								align-items: center;
								font-size: 15px;
							`}
						>
							<div
								css={css`
									cursor: pointer;
									flex: 1;
									user-select: none;
									display: inline-block;
									color: var(--ce-input-label-color);
									font-weight: var(
										--ce-input-label-font-weight
									);
									text-transform: var(
										--ce-input-label-text-transform,
										none
									);
									letter-spacing: var(
										--ce-input-label-letter-spacing,
										0
									);
								`}
							>
								{__('Form', 'checkout_engine')}
							</div>
							<div
								css={css`
									display: flex;
									align-items: center;
								`}
							>
								<Mode
									attributes={attributes}
									setAttributes={setAttributes}
								/>
								<div
									css={css`
										display: flex;
										align-items: center;
									`}
								>
									<Button
										onClick={() =>
											setTab(tab === 'cart' ? '' : 'cart')
										}
									>
										<span
											css={css`
												display: inline-block;
												vertical-align: top;
												box-sizing: border-box;
												margin: 1px 0 -1px 2px;
												padding: 0 5px;
												min-width: 18px;
												height: 18px;
												border-radius: 9px;
												background-color: currentColor;
												font-size: 11px;
												line-height: 1.6;
												text-align: center;
												z-index: 26;
											`}
										>
											<span
												css={css`
													color: #fff;
												`}
											>
												{
													(prices || []).filter(
														(p) => p?.id
													)?.length
												}
											</span>
										</span>

										<ce-icon
											name="shopping-bag"
											style={{ fontSize: '18px' }}
										/>
									</Button>
								</div>
							</div>
						</div>

						{tab === 'cart' && (
							<Cart
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						)}
					</div>
					<CeCheckout
						keys={ceData?.keys}
						mode={mode}
						formId={formId}
						css={css`
							margin-top: 2em;
							font-size: ${font_size}px;
						`}
						disableComponentsValidation={true}
						persistSession={false}
						alignment={align}
						className={className}
						choiceType={choice_type}
						prices={prices}
					>
						<div
							css={css`
								*
									> *
									> .wp-block:not(ce-columns):not(ce-choice):not(ce-column):not(:last-child) {
									margin-bottom: ${gap} !important;
								}
							`}
						>
							<InnerBlocks
								allowedBlocks={ALLOWED_BLOCKS}
								templateLock={false}
								renderAppender={
									blockCount
										? undefined
										: InnerBlocks.ButtonBlockAppender
								}
							/>
						</div>
					</CeCheckout>
				</div>
			)}
		</Fragment>
	);
}
