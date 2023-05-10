/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScSwitch } from '@surecart/components-react';
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
			title={__('Advanced Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Performance', 'surecart')}
				description={__(
					'Change your plugin performance settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.use_esm_loader}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							use_esm_loader: !item?.use_esm_loader,
						});
					}}
				>
					{__('Use JavaScript ESM Loader', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'This can slightly increase page load speed, but may require you to enable CORS headers for .js files on your CDN. Please check your checkout forms after you enable this option in a private browser window.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Beta Features', 'surecart')}
				description={__(
					'Opt-in to some beta features of the plugin.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.stripe_payment_element}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							stripe_payment_element:
								!item?.stripe_payment_element,
						});
					}}
				>
					{__('Use the Stripe Payment Element', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							"Use Stripe's Payment Element instead of the Card Element in all forms.",
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Uninstall', 'surecart')}
				description={__(
					'Change your plugin uninstall settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.uninstall}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							uninstall: !item?.uninstall,
						});
					}}
				>
					{__('Remove Plugin Data', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Completely remove all plugin data when deleted. This cannot be undone.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>
		</SettingsTemplate>
	);
};
