/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSelect } from '@surecart/components-react';
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
				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Checkout', 'surecart')}
					help={__('Checkout selection strategy.', 'surecart')}
				/>

				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Line Item', 'surecart')}
					help={__('Line Item selection strategy.', 'surecart')}
				/>
				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Shipping', 'surecart')}
					help={__('Shipping selection strategy.', 'surecart')}
				/>
			</SettingsBox>
			<SettingsBox
				title={__('Discount Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={false}
			>
				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Checkout', 'surecart')}
					help={__('Checkout selection strategy.', 'surecart')}
				/>

				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Line Item', 'surecart')}
					help={__('Line Item selection strategy.', 'surecart')}
				/>
				<ScSelect
					value={'all'}
					onScChange={(e) => console.log(e.target.value)}
					choices={selectionStrategyChoices}
					label={__('Shipping', 'surecart')}
					help={__('Shipping selection strategy.', 'surecart')}
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
