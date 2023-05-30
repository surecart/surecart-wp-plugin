/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScDialog,
	ScFormControl,
	ScIcon,
	ScSwitch,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import CustomerSyncModal from './components/CustomerSyncModal';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'settings'
	);
	const [modal, setModal] = useState(null);

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
					{__('Use The Stripe Payment Element', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							"Use Stripe's Payment Element instead of the Card Element in all forms.",
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Syncing', 'surecart')}
				description={__(
					'Manually sync your WordPress install with SureCart.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					<ScFormControl
						label={__('Customers', 'surecart')}
						help={__(
							'Match all SureCart customers with WordPress users. This is helpful if you have migrated from another eCommerce platform.',
							'surecart'
						)}
					/>
					<div>
						<ScButton onClick={() => setModal('customer-sync')}>
							<ScIcon name="users" slot="prefix"></ScIcon>
							{__('Sync Customers', 'surecart')}
						</ScButton>
					</div>
				</div>
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

			<CustomerSyncModal
				open={modal === 'customer-sync'}
				onRequestClose={() => setModal(null)}
			/>
		</SettingsTemplate>
	);
};
