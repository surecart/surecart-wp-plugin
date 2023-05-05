/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsTemplate from '../../SettingsTemplate';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';
import SettingsBox from '../../SettingsBox';
import { ScInput } from '@surecart/components-react';
import Error from '../../../components/Error';
import Products from './Products';
import ShippingZones from './ShippingZones';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default () => {
	const [error, setError] = useState();
	const shippingProfileId = getQueryArg(window.location.href, 'profile');

	const { createSuccessNotice } = useDispatch(noticesStore);

	const { shippingProfile, loadingShippingProfile } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'shipping-profile',
				shippingProfileId,
				{
					expand: ['shipping_zones'],
				},
			];

			return {
				shippingProfile: select(coreStore).getEditedEntityRecord(
					...queryArgs
				),
				loadingShippingProfile: select(coreStore).isResolving(
					'getEditedEntityRecord',
					queryArgs
				),
			};
		},
		[shippingProfileId]
	);
	const { editEntityRecord, saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async () => {
		setError(null);
		try {
			await saveEntityRecord(
				'surecart',
				'shipping-profile',
				shippingProfile
			);
			createSuccessNotice(__('Updated', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const onEdit = (key, value) => {
		editEntityRecord('surecart', 'shipping-profile', shippingProfileId, {
			[key]: value,
		});
	};

	return (
		<SettingsTemplate
			title={__('Manage Shipping Profile')}
			prefix={
				<sc-button
					href={removeQueryArgs(
						window.location.href,
						'type',
						'profile'
					)}
					circle
					size="small"
				>
					<sc-icon name="arrow-left"></sc-icon>
				</sc-button>
			}
			onSubmit={onSubmit}
			noButton
		>
			<Error error={error} setError={setError} margin="80px" />
			<SettingsBox loading={loadingShippingProfile}>
				<ScInput
					label={__('Name', 'surecart')}
					type="text"
					required
					value={shippingProfile?.name}
					onScInput={(e) => {
						onEdit('name', e.target.value || null);
					}}
					help={__("Customers won't see this.", 'surecart')}
				/>
			</SettingsBox>
			<Products
				shippingProfileId={shippingProfileId}
				loading={loadingShippingProfile}
				products={shippingProfile?.products?.data}
			/>
			<ShippingZones
				shippingProfileId={shippingProfileId}
				shippingZones={shippingProfile?.shipping_zones?.data}
				loading={loadingShippingProfile}
			/>
		</SettingsTemplate>
	);
};
