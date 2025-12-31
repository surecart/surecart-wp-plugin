import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import useEntity from '../../hooks/useEntity';
import { StrategyRadioGroup } from './components/StrategyRadioGroup';
import { FEE_STRATEGIES, DISCOUNT_STRATEGIES } from './utils';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'auto_fee_protocol'
	);

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

	return (
		<SettingsTemplate
			title={__('Dynamic Pricing Settings', 'surecart')}
			icon={<sc-icon name="badge-percent"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Fees Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={!hasLoadedItem}
			>
				{FEE_STRATEGIES.map(({ label, key, target }) => (
					<StrategyRadioGroup
						key={key}
						label={label}
						help={__('Selection strategy.', 'surecart')}
						value={item?.[key]}
						type="fee"
						target={target}
						onChange={(e) => editItem({ [key]: e.target.value })}
					/>
				))}
			</SettingsBox>
			<SettingsBox
				title={__('Discount Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={!hasLoadedItem}
			>
				{DISCOUNT_STRATEGIES.map(({ label, key, target }) => (
					<StrategyRadioGroup
						key={key}
						label={label}
						help={__('Selection strategy.', 'surecart')}
						value={item?.[key]}
						type="discount"
						target={target}
						onChange={(e) => editItem({ [key]: e.target.value })}
					/>
				))}
			</SettingsBox>
		</SettingsTemplate>
	);
};
