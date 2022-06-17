import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScInput } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'settings'
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
			title={__('Connection Settings', 'surecart')}
			icon={<sc-icon name="upload-cloud"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Connection Details', 'surecart')}
				description={__(
					'Update your api token to change or update the connection to SureCart.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScInput
					label={__('API Token', 'surecart')}
					placeholder={__('Enter your api token', 'surecart')}
					value={item?.api_token}
					type="password"
					onScInput={(e) => editItem({ api_token: e.target.value })}
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
