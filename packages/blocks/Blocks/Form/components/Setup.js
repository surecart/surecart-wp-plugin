/** @jsx jsx */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createBlocksFromInnerBlocksTemplate, parse } from '@wordpress/blocks';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { BlockPreview } from '@wordpress/block-editor';

import {
	CeRadioGroup,
	CeRadio,
	CeButton,
	CeChoices,
	CeChoice,
} from '@checkout-engine/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { useState } from 'react';
import ChooseDesign from './ChooseDesign';

export default ({ onCreate }) => {
	const [choices, setChoices] = useState([]);
	const [choice_type, setChoiceType] = useState('all');
	const [template, setTemplate] = useState('default');
	const [custom_success_url, setCustomSuccessUrl] = useState(false);
	const [success_url, setSuccessUrl] = useState('');

	const hasValidChoices = () => {
		return !!(choices || []).find((choice) => !!choice.id);
	};

	const removeChoice = (index) => {
		setChoices(choices.filter((_, i) => i !== index));
	};

	const updateChoice = (data, index) => {
		setChoices(
			choices.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			})
		);
	};

	const addProduct = () => {
		setChoices([
			...(choices || []),
			{
				quantity: 1,
			},
		]);
	};

	const createNewPrice = () => {};

	return (
		<ChooseDesign
			template={template}
			setTemplate={setTemplate}
			onChoose={() => {}}
		/>
	);

	return (
		<div
			css={css`
				font-family: var(--ce-font-sans);
				font-size: 13px;
				box-sizing: border-box;
				position: relative;
				padding: 3em;
				min-height: 200px;
				width: 100%;
				text-align: left;
				margin: 0;
				-moz-font-smoothing: subpixel-antialiased;
				-webkit-font-smoothing: subpixel-antialiased;
				border-radius: 2px;
				background-color: #fff;
				box-shadow: inset 0 0 0 1px var(--ce-color-gray-300);
				outline: 1px solid transparent;
			`}
			style={{
				'--ce-color-primary-500': 'var(--wp-admin-theme-color)',
				'--ce-focus-ring-color-primary': 'var(--wp-admin-theme-color)',
				'--ce-input-border-color-focus': 'var(--wp-admin-theme-color)',
			}}
		>
			<div
				css={css`
					font-size: 14px;
					display: flex;
					flex-direction: column;
					gap: 2em;
				`}
			>
				<ce-dashboard-module
					heading={__('Products', 'checkout_engine')}
				>
					<PriceChoices
						choices={choices}
						onAddProduct={addProduct}
						onUpdate={updateChoice}
						onRemove={removeChoice}
						onNew={createNewPrice}
					/>
				</ce-dashboard-module>

				{hasValidChoices() && (
					<ce-dashboard-module
						heading={__('Product Options', 'checkout_engine')}
					>
						<CeRadioGroup
							onCeChange={(e) => setChoiceType(e.target.value)}
						>
							<CeRadio
								value="all"
								checked={choice_type === 'all'}
							>
								{__(
									'Customer must purchase all products',
									'checkout_engine'
								)}
							</CeRadio>
							<CeRadio
								value="radio"
								checked={choice_type === 'radio'}
							>
								{__(
									'Customer must select one price from the options.',
									'checkout_engine'
								)}
							</CeRadio>
							<CeRadio
								value="checkbox"
								checked={choice_type === 'checkbox'}
							>
								{__(
									'Customer can select multiple prices.',
									'checkout_engine'
								)}
							</CeRadio>
						</CeRadioGroup>
					</ce-dashboard-module>
				)}

				{/* <BlockPreview
					blocks={createBlocksFromInnerBlocksTemplate(
						parse(`
            <!-- wp:checkout-engine/form  -->
            <!-- wp:checkout-engine/price-selector {"label":"Choose A Product"}  -->
          <ce-price-choices type="radio" columns="1"><div><!-- wp:checkout-engine/price-choice -->
          <ce-price-choice type="radio" show-label="1" show-price="1" show-control="1"></ce-price-choice>
          <!-- /wp:checkout-engine/price-choice --></div></ce-price-choices>
          <!-- /wp:checkout-engine/price-selector -->

          <!-- wp:checkout-engine/express-payment -->
          <ce-express-payment divider-text="or" class="wp-block-checkout-engine-express-payment"></ce-express-payment>
          <!-- /wp:checkout-engine/express-payment -->

          <!-- wp:checkout-engine/columns -->
          <ce-columns class="wp-block-checkout-engine-columns"><!-- wp:checkout-engine/column -->
          <ce-column class="wp-block-checkout-engine-column"><!-- wp:checkout-engine/name -->
          <ce-customer-name label="Name" class="wp-block-checkout-engine-name"></ce-customer-name>
          <!-- /wp:checkout-engine/name --></ce-column>
          <!-- /wp:checkout-engine/column -->

          <!-- wp:checkout-engine/column -->
          <ce-column class="wp-block-checkout-engine-column"><!-- wp:checkout-engine/email -->
          <ce-email label="Email" autocomplete="email" inputmode="email" required class="wp-block-checkout-engine-email"></ce-customer-email>
          <!-- /wp:checkout-engine/email --></ce-column>
          <!-- /wp:checkout-engine/column --></ce-columns>
          <!-- /wp:checkout-engine/columns -->

          <!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
          <ce-payment label="Payment" secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
          <!-- /wp:checkout-engine/payment -->

          <!-- wp:checkout-engine/totals {"collapsible":true,"collapsed":false} -->
          <ce-order-summary collapsible="1" class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
          <ce-divider></ce-divider>
          <!-- /wp:checkout-engine/divider -->

          <!-- wp:checkout-engine/line-items -->
          <ce-line-items removable="1" editable="1" class="wp-block-checkout-engine-line-items"></ce-line-items>
          <!-- /wp:checkout-engine/line-items -->

          <!-- wp:checkout-engine/divider -->
          <ce-divider></ce-divider>
          <!-- /wp:checkout-engine/divider -->

          <!-- wp:checkout-engine/subtotal -->
          <ce-line-item-total class="ce-subtotal" total="subtotal" class="wp-block-checkout-engine-subtotal"><span slot="description">Subtotal</span></ce-line-item-total>
          <!-- /wp:checkout-engine/subtotal -->

          <!-- wp:checkout-engine/tax-line-item -->
          <ce-line-item-tax class="wp-block-checkout-engine-tax-line-item"></ce-line-item-tax>
          <!-- /wp:checkout-engine/tax-line-item -->

          <!-- wp:checkout-engine/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
          <ce-coupon-form label="Add Coupon Code">Apply Coupon</ce-coupon-form>
          <!-- /wp:checkout-engine/coupon -->

          <!-- wp:checkout-engine/divider -->
          <ce-divider></ce-divider>
          <!-- /wp:checkout-engine/divider -->

          <!-- wp:checkout-engine/total -->
          <ce-line-item-total class="ce-line-item-total" total="total" size="large" show-currency="1" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
          <!-- /wp:checkout-engine/total --></ce-order-summary>
          <!-- /wp:checkout-engine/totals -->

          <!-- wp:checkout-engine/submit {"show_total":true,"full":true} -->
          <ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit"><svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewbox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Purchase<span> <ce-total></ce-total></span></ce-button>
          <!-- /wp:checkout-engine/submit -->

<!-- /wp:checkout-engine/form -->
          `)
					)}
				/>
				<BlockPreview
					blocks={createBlocksFromInnerBlocksTemplate([
						[
							'checkout-engine/button',
							{
								type: 'primary',
								text: __('Preview', 'checkout_engine'),
							},
						],
					])}
				/> */}

				<ce-dashboard-module heading={__('Design', 'checkout_engine')}>
					<CeChoices style={{ '--columns': 4 }}>
						<div>
							<CeChoice
								showControl={false}
								showPrice={false}
								checked={template === 'default'}
								onCeChange={(e) => {
									if (!e.target.checked) return;
									setTemplate('default');
								}}
							>
								{__('Default', 'checkout_engine')}
								<span slot="description">
									{__(
										'A basic checkout form.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
							<CeChoice
								showControl={false}
								showPrice={false}
								checked={template === 'simple'}
								onCeChange={(e) => {
									if (!e.target.checked) return;
									setTemplate('simple');
								}}
							>
								{__('Simple', 'checkout_engine')}
								<span slot="description">
									{__(
										'A very minimal form with very few options.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
							<CeChoice
								showControl={false}
								showPrice={false}
								checked={template === 'sections'}
								onCeChange={(e) => {
									if (!e.target.checked) return;
									setTemplate('sections');
								}}
							>
								<div
									style={{
										color: 'var(--ce-color-gray-200)',
										marginBottom: '1em',
									}}
								>
									<svg
										width="50"
										viewBox="0 0 253 254"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="1"
											y="161"
											width="68"
											height="252"
											transform="rotate(-90 1 161)"
											fill="currentColor"
										/>
										<rect
											x="1"
											y="254"
											width="68"
											height="252"
											transform="rotate(-90 1 254)"
											fill="currentColor"
										/>
										<rect
											y="68"
											width="68"
											height="253"
											transform="rotate(-90 0 68)"
											fill="currentColor"
										/>
									</svg>
								</div>
								{__('Sections', 'checkout_engine')}
								<span slot="description">
									{__(
										'A form divided into sections.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>

							<CeChoice
								showControl={false}
								showPrice={false}
								checked={template === 'two-column'}
								onCeChange={(e) => {
									if (!e.target.checked) return;
									setTemplate('two-column');
								}}
							>
								<div
									style={{
										color: 'var(--ce-color-gray-200)',
										marginBottom: '1em',
									}}
								>
									<svg
										width="50"
										viewBox="0 0 253 254"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											width="110"
											height="254"
											fill="currentColor"
										/>
										<rect
											x="143"
											width="110"
											height="254"
											fill="currentColor"
										/>
									</svg>
								</div>

								{__('Two Column', 'checkout_engine')}
								<span slot="description">
									{__(
										'A form divided into two columns.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
						</div>
					</CeChoices>

					{/* <CeSelect
						css={css`
							max-width: 400px;
						`}
						placeholder={__(
							'Select a Form Template',
							'checkout_engine'
						)}
						value={template}
						onCeChange={(e) => setTemplate(e.target.value)}
						choices={[
							{
								value: 'default',
								label: __('Default', 'checkout_engine'),
							},
							{
								value: 'sections',
								label: __('Sections', 'checkout_engine'),
							},
							{
								value: 'two-column',
								label: __('Two Column', 'checkout_engine'),
							},
							{
								value: 'simple',
								label: __('Simple', 'checkout_engine'),
							},
						]}
					/> */}
				</ce-dashboard-module>

				<ce-dashboard-module
					heading={__('Thank You Page', 'checkout_engine')}
				>
					<ToggleControl
						label={__('Custom Thank You Page', 'checkout_engine')}
						checked={custom_success_url}
						onChange={(custom_success_url) =>
							setCustomSuccessUrl(custom_success_url)
						}
					/>
					{custom_success_url && (
						<LinkControl
							value={{ url: success_url }}
							noURLSuggestion
							showInitialSuggestions
							onChange={(nextValue) => {
								setSuccessUrl(nextValue.url);
							}}
						/>
					)}
				</ce-dashboard-module>

				{!!onCreate && (
					<div>
						<CeButton
							type="primary"
							onClick={() =>
								onCreate({
									choices,
									choice_type,
									template,
									custom_success_url,
									success_url,
								})
							}
						>
							{__('Create Form', 'checkout_engine')}
						</CeButton>
					</div>
				)}
			</div>
		</div>
	);
};
