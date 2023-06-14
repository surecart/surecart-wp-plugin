/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsTemplate from '../../SettingsTemplate';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';
import SettingsBox from '../../SettingsBox';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Error from '../../../components/Error';
import Products from './Products';
import ShippingZones from '../zone/ShippingZones';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import FallbackZone from '../zone/FallbackZone';
import DeleteShippingProfile from './DeleteShippingProfile';
const modals = {
	CONFIRM_DELETE_PROFILE: 'confirm_delete_profile',
};
export default () => {
	const [error, setError] = useState();
	const [currentModal, setCurrentModal] = useState('');
	const shippingProfileId = getQueryArg(window.location.href, 'profile');

	const { createSuccessNotice } = useDispatch(noticesStore);

	const { shippingProfile, loadingShippingProfile } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'shipping-profile',
				shippingProfileId,
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
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);

	const onSubmit = async () => {
		setError(null);
		try {
			// build up pending records to save.
			const dirtyRecords =
				select(coreStore).__experimentalGetDirtyEntityRecords();
			const pendingSavedRecords = [];
			dirtyRecords.forEach(({ kind, name, key }) => {
				pendingSavedRecords.push(
					saveEditedEntityRecord(kind, name, key)
				);
			});

			// check values.
			const values = await Promise.all(pendingSavedRecords);
			if (values.some((value) => typeof value === 'undefined')) {
				throw new Error(__('Saving failed.', 'surecart'));
			}

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
			title={__('Manage Shipping Profile', 'surecart')}
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
			suffix={
				!shippingProfile?.default && (
					<ScDropdown placement="bottom-end">
						<ScButton type="text" slot="trigger" circle>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem
								onClick={() =>
									setCurrentModal(
										modals.CONFIRM_DELETE_PROFILE
									)
								}
							>
								<ScIcon slot="prefix" name="trash" />
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				)
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
				isDefaultProfile={!!shippingProfile.default}
			/>
			<ShippingZones
				shippingProfileId={shippingProfileId}
				loading={loadingShippingProfile}
				fallbackZoneId={shippingProfile?.fallback_shipping_zone}
			/>

			<FallbackZone
				shippingProfile={shippingProfile}
				loading={loadingShippingProfile}
				onEditShippingProfile={onEdit}
			/>

			{currentModal && (
				<DeleteShippingProfile
					open={currentModal === modals.CONFIRM_DELETE_PROFILE}
					onRequestClose={() => setCurrentModal('')}
					shippingProfileId={shippingProfileId}
				/>
			)}
		</SettingsTemplate>
	);
};
