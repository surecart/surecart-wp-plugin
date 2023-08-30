import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScFormControl, ScInput } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import IncomingWebhooks from './IncomingWebhooks';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import ResyncWebhooks from './components/ResyncWebhooks';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'settings'
	);

	/** Load registered webhook */
	const webhook = useSelect((select) =>
		select(coreStore).getEntityRecord(
			'surecart',
			'store',
			'webhook_endpoint'
		)
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

			{item?.api_token && <IncomingWebhooks />}

			{!!webhook?.id && (
				<SettingsBox
					title={__('Advanced Options', 'surecart')}
					description={__(
						'Advanced connection options and troubleshooting.',
						'surecart'
					)}
					noButton
				>
					<ScFormControl
						help={__(
							'This will refetch the webhooks connection settings with your store in the case of an invalid signature or similar issue.',
							'surecart'
						)}
					>
						<ResyncWebhooks webhook={webhook} />
					</ScFormControl>
				</SettingsBox>
			)}
		</SettingsTemplate>
	);
};
