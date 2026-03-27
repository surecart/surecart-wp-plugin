import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import useEntity from '../../hooks/useEntity';
import { TargetStrategyRow } from './components/TargetStrategyRow';
import { TARGETS } from './utils';

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
			style={{
				'--wp-components-color-foreground':
					'var(--sc-color-primary-500)',
			}}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Selection Strategy', 'surecart')}
				description={__(
					'Control which applicable fees and discounts are applied when multiple options are available.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				{TARGETS.map((target) => (
					<TargetStrategyRow
						key={target.id}
						target={target}
						item={item}
						editItem={editItem}
					/>
				))}
			</SettingsBox>
		</SettingsTemplate>
	);
};
