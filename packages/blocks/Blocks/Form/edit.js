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
		const result = await apiFetch({
			url: ceData.plugin_url + '/templates/forms/' + template + '.html',
			parse: false,
			cache: 'no-cache',
		});
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(parse(await result.text())),
			false
		);
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

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Form Template', 'checkout_engine')}>
					<PanelRow>
						<div>
							<SelectControl
								label={__('Template')}
								value={template}
								onChange={(name) => setTemplate(name)}
								options={[
									{
										value: null,
										label: 'Select a Template',
										disabled: true,
									},
									{ value: 'default', label: 'Default' },
									{ value: 'sections', label: 'Sections' },
									{ value: 'simple', label: 'Simple' },
								]}
							/>
							<Button isPrimary onClick={changeTemplate}>
								{__('Change', 'checkout_engine')}
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

			<div
				css={css`
					max-width: var(--ast-content-width-size, 910px);
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
								font-weight: var(--ce-input-label-font-weight);
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
					persistSession={false}
					alignment={align}
					className={className}
					choiceType={choice_type}
					prices={prices}
				>
					<div
						css={css`
							* > * > .wp-block:not(ce-columns):not(ce-column) {
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
		</Fragment>
	);
}
