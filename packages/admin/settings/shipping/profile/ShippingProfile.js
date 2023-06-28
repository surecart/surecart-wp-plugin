/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsTemplate from '../../SettingsTemplate';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';
import SettingsBox from '../../SettingsBox';
import {
	ScAlert,
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
	const [showAdvanced, setShowAdvanced] = useState(false);
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

	const {
		shippingZones,
		loadingShippingZones,
		fetchingShippingZones,
		hasRates,
	} = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'shipping-zone',
			{
				shipping_profile_ids: [shippingProfileId],
				per_page: 100,
				expand: ['shipping_rates', 'shipping_rates.shipping_method'],
			},
		];

		const loading = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);

		const shippingZones =
			select(coreStore).getEntityRecords(...queryArgs) || [];

		const hasRates = shippingZones.some(
			(zone) => zone.shipping_rates?.data?.length
		);

		return {
			shippingZones,
			hasRates: hasRates || loading,
			loadingShippingZones: loading && !shippingZones?.length,
			fetchingShippingZones: loading && !!shippingZones?.length,
		};
	});

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
			{!hasRates && (
				<ScAlert
					type="warning"
					open
					title={__('No shipping rates', 'surecart')}
				>
					{__(
						'First create a shipping zone (where you ship to) and then a shipping rate (the cost to ship there).',
						'surecart'
					)}
				</ScAlert>
			)}
			<SettingsBox
				title={__('Profile Details', 'surecart')}
				loading={loadingShippingProfile}
			>
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
				shippingZones={shippingZones}
				loading={loadingShippingZones}
				fetching={fetchingShippingZones}
				shippingProfileId={shippingProfileId}
				fallbackZoneId={shippingProfile?.fallback_shipping_zone}
			/>

			{!!shippingZones?.length && (
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-xx-large);
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 1em;
							cursor: pointer;
						`}
						onClick={() => setShowAdvanced(!showAdvanced)}
					>
						{__('Advanced Options', 'surecart')}
						<ScIcon name="chevron-down" />
					</div>

					{!!showAdvanced && (
						<>
							<FallbackZone
								shippingZones={shippingZones}
								loading={loadingShippingZones}
								shippingProfile={shippingProfile}
								onEditShippingProfile={onEdit}
							/>
						</>
					)}
				</div>
			)}

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
