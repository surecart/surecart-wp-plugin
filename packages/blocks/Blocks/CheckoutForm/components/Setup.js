/** @jsx jsx */
import { Button, ToggleControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import {
	CeInput,
	CeRadioGroup,
	CeSelect,
	CeRadio,
} from '@checkout-engine/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';

export default ({ attributes, setAttributes, onCreate, onCancel, isNew }) => {
	const {
		choices,
		choice_type,
		title,
		template,
		create_user_account,
		custom_success_url,
	} = attributes;

	const label = css`
		font-weight: 500;
		font-size: 1.2em;
		margin-bottom: 1em;
	`;

	const hasValidChoices = () => {
		return !!(choices || []).find((choice) => !!choice.id);
	};

	const removeChoice = (index) => {
		setAttributes({
			choices: choices.filter((item, i) => i !== index),
		});
	};

	const updateChoice = (data, index) => {
		setAttributes({
			choices: choices.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			}),
		});
	};

	const addProduct = () => {
		setAttributes({
			choices: [
				...(choices || []),
				{
					quantity: 1,
				},
			],
		});
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
				color: var(--ce-color-gray-500);
				-moz-font-smoothing: subpixel-antialiased;
				-webkit-font-smoothing: subpixel-antialiased;
				border-radius: 2px;
				background-color: #fff;
				box-shadow: inset 0 0 0 1px var(--ce-color-gray-300);
				outline: 1px solid transparent;
			`}
		>
			<div
				css={css`
					font-size: 14px;
					display: flex;
					flex-direction: column;
					gap: 2em;
				`}
			>
				{isNew && (
					<div>
						<div css={label}>
							{__('Form Title', 'checkout_engine')}
						</div>
						<CeInput
							css={css`
								max-width: 400px;
							`}
							value={title}
							placeholder={__(
								'Enter a title for your form',
								'checkout_engine'
							)}
							onCeChange={(e) =>
								setAttributes({ title: e.target.value })
							}
						/>
					</div>
				)}

				<div>
					<div css={label}>{__('Products', 'checkout_engine')}</div>
					<PriceChoices
						choices={choices}
						onAddProduct={addProduct}
						onUpdate={updateChoice}
						onRemove={removeChoice}
						onNew={createNewPrice}
					/>
				</div>

				{hasValidChoices() && (
					<div>
						<div css={label}>
							{__('Product Options', 'checkout_engine')}
						</div>

						<CeRadioGroup
							onCeChange={(e) =>
								setAttributes({ choice_type: e.target.value })
							}
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
					</div>
				)}

				<div>
					<div css={label}>{__('Design', 'checkout_engine')}</div>

					<CeSelect
						css={css`
							max-width: 400px;
						`}
						placeholder={__(
							'Select a Form Template',
							'checkout_engine'
						)}
						value={template}
						onCeChange={(e) =>
							setAttributes({
								template: e.target.value,
							})
						}
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
					/>
				</div>

				<div>
					<div css={label}>
						{__('Thank You Page', 'checkout_engine')}
					</div>
					<ToggleControl
						label={__('Custom Thank You Page', 'checkout_engine')}
						checked={custom_success_url}
						onChange={(custom_success_url) =>
							setAttributes({ custom_success_url })
						}
					/>
					{custom_success_url && (
						<LinkControl
							value={{ url: attributes.success_url }}
							noURLSuggestion
							showInitialSuggestions
							onChange={() => {}}
						/>
					)}
				</div>

				{!!onCreate && (
					<div>
						<Button isPrimary onClick={onCreate}>
							{__('Create Form', 'checkout_engine')}
						</Button>
						{onCancel && (
							<Button onClick={onCancel}>
								{__('Cancel', 'checkout_engine')}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
