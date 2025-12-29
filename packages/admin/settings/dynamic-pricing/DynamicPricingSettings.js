/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex, ScRadioGroup, ScRadio } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { useEntityRecord } from '@wordpress/core-data';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const selectionStrategyChoices = [
		{
			label: __('All', 'surecart'),
			value: 'all',
			help: __('All', 'surecart'),
		},
		{
			label: __('First', 'surecart'),
			value: 'first',
		},
		{
			label: __('Biggest', 'surecart'),
			value: 'biggest',
		},
		{
			label: __('Lowest', 'surecart'),
			value: 'lowest',
		},
	];

	const HELP_TEXT_MAP = {
		fee: {
			all: __('All fees will be applied in checkout', 'surecart'),
			first: __('First fee will be applied for line item', 'surecart'),
			biggest: __(
				'The biggest fee will be applied for shipping',
				'surecart'
			),
			lowest: __(
				'The lowest discount will be applied for shipping',
				'surecart'
			),
		},
		discount: {
			all: __('All discounts will be applied in checkout', 'surecart'),
			first: __(
				'First discount will be applied for line item',
				'surecart'
			),
			lowest: __(
				'The lowest discount will be applied for shipping',
				'surecart'
			),
			biggest: __(
				'The biggest fee will be applied for shipping',
				'surecart'
			),
		},
	};

	const radioChoices = (selectionStrategyChoices || []).map((strategy) => {
		return (
			<ScRadio
				value={strategy?.value}
				checked={'all' === strategy?.value}
			>
				{strategy?.label}
			</ScRadio>
		);
	});

	const getHelpText = (type = 'discount', value = 'all') =>
		HELP_TEXT_MAP[type]?.[value] ?? '';

	return (
		<SettingsTemplate
			title={__('Dynamic Pricing Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
			loading={false}
		>
			<Error error={error} setError={setError} margin="80px" />

			<SettingsBox
				title={__('Fees Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={false}
			>
				<ScRadioGroup
					label={__('Checkout', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Checkout selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText()}
					</div>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Line Item', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Line Item selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Shipping', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Shipping selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
				</ScRadioGroup>
			</SettingsBox>
			<SettingsBox
				title={__('Discount Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={false}
			>
				<ScRadioGroup
					label={__('Checkout', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Checkout selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Line Item', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Line Item selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Shipping', 'surecart')}
					onScChange={(e) => console.log(e.target.value)}
					help={__('Shipping selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						{radioChoices}
					</ScFlex>
				</ScRadioGroup>
			</SettingsBox>
		</SettingsTemplate>
	);
};
