/** @jsx jsx */
import { Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import {
	CeRadioGroup,
	CeSelect,
	CeRadio,
	CeButton,
	CeChoices,
	CeChoice,
} from '@checkout-engine/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { useState } from 'react';

export default ({ onCreate, onCancel, clientId }) => {
	const [choices, setChoices] = useState([]);
	const [choice_type, setChoiceType] = useState('all');
	const [template, setTemplate] = useState('default');
	const [custom_success_url, setCustomSuccessUrl] = useState(false);
	const [success_url, setSuccessUrl] = useState('');

	const label = css`
		font-weight: 500;
		font-size: 1.2em;
		margin-bottom: 1em;
	`;

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
