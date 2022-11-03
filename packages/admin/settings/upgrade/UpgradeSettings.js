/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScAlert, ScButton, ScInput } from '@surecart/components-react';
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
			title={__('Upgrade to Pro', 'surecart')}
			icon={<sc-icon name="zap"></sc-icon>}
			onSubmit={onSubmit}
			noButton
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<ScAlert open>
				<span slot="title">Get more features to make you money.</span>
				Upgrade Here
				<div>
					<ScButton type="primary">Upgrade Now</ScButton>
				</div>
			</ScAlert>

			<SettingsBox
				title={__('Upgrade This Store', 'surecart')}
				description={__(
					'Enter your license key to activate your plan on thie store.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScInput
					label={__('License Key', 'surecart')}
					placeholder={__('Enter your license key', 'surecart')}
					value={item?.api_token}
					type="password"
					onScInput={(e) => editItem({ api_token: e.target.value })}
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
