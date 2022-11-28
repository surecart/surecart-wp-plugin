/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFormControl, ScInput, ScSwitch } from '@surecart/components-react';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'portal_protocol'
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
			title={__('Customer Portal', 'surecart')}
			icon={<sc-icon name="briefcase"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Functionality', 'surecart')}
				description={__(
					'Manage what your customers are able to see and do from the customer portal.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.subscription_updates_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							subscription_updates_enabled:
								!item?.subscription_updates_enabled,
						});
					}}
				>
					{__('Allow Subscription Changes', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to switch pricing plans from the customer portal. You can configure what happens when a subscription change happens from the Subscriptions settings page.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.subscription_quantity_updates_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							subscription_quantity_updates_enabled:
								!item?.subscription_quantity_updates_enabled,
						});
					}}
				>
					{__('Allow Subscription Quantity Changes', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to change subscription quantities from the customer portal.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={item?.subscription_cancellations_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							subscription_cancellations_enabled:
								!item?.subscription_cancellations_enabled,
						});
					}}
				>
					{__('Allow Subscription Cancellations', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Customers will be able to cancel their subscriptions from the customer portal. You can configure what happens when a subscription cancellation happens from the Subscriptions settings page.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Store Details', 'surecart')}
				description={__(
					'Set additional customer portal details for your store.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScInput
						label={__('Terms of Service', 'surecart')}
						type="url"
						value={item?.terms_url}
						onScInput={(e) => {
							editItem({
								terms_url: e.target.value || null,
							});
						}}
						help={__(
							'A link to your privacy terms page.',
							'surecart'
						)}
					/>
					<ScInput
						label={__('Privacy Policy', 'surecart')}
						type="url"
						value={item?.privacy_url}
						onScInput={(e) => {
							editItem({
								privacy_url: e.target.value || null,
							});
						}}
						help={__(
							'A link to your privacy policy page.',
							'surecart'
						)}
					/>
				</div>
			</SettingsBox>
		</SettingsTemplate>
	);
};
