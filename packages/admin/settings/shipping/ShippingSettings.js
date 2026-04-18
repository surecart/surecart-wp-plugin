/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import SettingsTemplate from '../SettingsTemplate';
import {
	ScAlert,
	ScButton,
	ScCard,
	ScEmpty,
	ScFormControl,
	ScIcon,
	ScInput,
	ScPremiumTag,
	ScStackedList,
	ScSwitch,
	ScUpgradeRequired,
} from '@surecart/components-react';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import AddShippingProfile from './profile/AddShippingProfile';
import useEntity from '../../hooks/useEntity';
import ShippingMethods from './method/ShippingMethods';
import ParcelTemplates from './parcel/ParcelTemplates';
import useSave from '../UseSave';
import ShippingProfileListItem from './profile/ShippingProfileListItem';

export default () => {
	const [error, setError] = useState(null);
	const [showAddShipping, setShowAddShipping] = useState(false);
	const [showNotice, setShowNotice] = useState(false);
	const { save } = useSave();

	const [googleMapApiEnabled, setGoogleMapApiEnabled] = useEntityProp(
		'root',
		'site',
		'surecart_google_map_api_key_enabled'
	);

	const [googleMapApiKey, setGoogleMapApiKey] = useEntityProp(
		'root',
		'site',
		'surecart_google_map_api_key'
	);

	const {
		hasRates,
		hasZones,
		shippingProfiles,
		defaultShippingProfile,
		loading,
	} = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'shipping-profile',
			{
				context: 'edit',
				per_page: 100,
				expand: [
					'products',
					'shipping_zones',
					'shipping_zone.shipping_rates',
				],
			},
		];

		const items = select(coreStore).getEntityRecords(...queryArgs);
		const resolving = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);

		const hasZones = (items || []).some(
			({ shipping_zones }) => !!shipping_zones?.data?.length
		);

		return {
			hasRates,
			hasZones,
			defaultShippingProfile: (items || []).find(
				(profile) => profile.default
			),
			shippingProfiles: (items || []).filter(
				(profile) => !profile.default
			),
			loading: !!(!items?.length && resolving),
			busy: !!(items?.length && resolving),
		};
	}, []);

	const {
		item: shippingProtocol,
		hasLoadedItem: hasLoadedShippingProtocol,
		editItem: editShippingProtocol,
	} = useEntity('store', 'shipping_protocol');

	/**
	 * Validate the Google Maps API key.
	 *
	 * @param {string} apiKey - The Google Maps API key.
	 * @returns {boolean} - Returns true if the API key is valid, otherwise false.
	 */
	const validateGoogleMapApiKey = async (apiKey) => {
		try {
			const response = await fetch(
				'https://places.googleapis.com/v1/places:searchText',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Goog-Api-Key': apiKey,
						'X-Goog-FieldMask': 'places.id',
					},
					body: JSON.stringify({
						textQuery: 'test',
						pageSize: 1,
					}),
				}
			);
			const data = await response.json();
			if (data?.error?.message) {
				setError(
					sprintf(
						__('Google Map API Key Error: %s', 'surecart'),
						data.error.message
					)
				);
				return false;
			}
			return true;
		} catch (e) {
			console.error(e);
			setError(
				__(
					'An error occurred while validating the API key.',
					'surecart'
				)
			);
			return false;
		}
	};

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			// Validate Google Maps API key if enabled.
			if (googleMapApiEnabled) {
				if (!googleMapApiKey) {
					setError(
						__(
							'Please enter a Google Maps API key or disable the Google Maps API.',
							'surecart'
						)
					);
					return;
				}
				const isValid = await validateGoogleMapApiKey(googleMapApiKey);
				if (!isValid) return;
			}

			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const onToggleShipping = (e) => {
		e.preventDefault();
		editShippingProtocol({
			shipping_enabled: !shippingProtocol?.shipping_enabled,
		});
	};

	const upgradeRequired = () => {
		const shippingProfileEntitlements =
			window.scData?.entitlements?.shipping_profiles;

		return (
			!!shippingProfileEntitlements?.limit &&
			shippingProfileEntitlements?.count >=
				shippingProfileEntitlements?.limit
		);
	};

	return (
		<Fragment>
			<SettingsTemplate
				title={__('Shipping', 'surecart')}
				icon={<ScIcon name="truck" />}
				noButton
				onSubmit={onSubmit}
			>
				<Error error={error} setError={setError} margin="80px" />{' '}
				{!loading &&
					!hasZones &&
					shippingProtocol?.shipping_enabled && (
						<ScAlert
							type="warning"
							open
							title={__('No shipping rates', 'surecart')}
						>
							{__(
								'To complete the shipping setup, please add shipping rates to a shipping profile below.',
								'surecart'
							)}
						</ScAlert>
					)}
				<SettingsBox
					loading={!hasLoadedShippingProtocol}
					title={__('Shipping Settings', 'surecart')}
				>
					<ScSwitch
						checked={shippingProtocol?.shipping_enabled}
						onClick={onToggleShipping}
					>
						{__('Enable Shipping Rates', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Enabling shipping rates allows you to charge shipping costs and restrict purchase areas.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</SettingsBox>
				<SettingsBox
					title={__('Address Autocomplete', 'surecart')}
					loading={!hasLoadedShippingProtocol}
				>
					<ScSwitch
						checked={googleMapApiEnabled}
						onScChange={(e) => {
							setGoogleMapApiEnabled(e.target.checked);
							setShowNotice(true);
						}}
					>
						{__('Google Maps API', 'surecart')}
						<span slot="description">
							{__(
								'Enable Google Maps API for the shipping address field autocompletion.',
								'surecart'
							)}
						</span>
					</ScSwitch>

					{showNotice && (
						<ScAlert open>
							<span slot="title">
								{__('Important', 'surecart')}
							</span>
							{__(
								'Please clear checkout page cache after changing this setting.',
								'surecart'
							)}
						</ScAlert>
					)}

					{googleMapApiEnabled && (
						<>
							<ScInput
								value={googleMapApiKey}
								label={__('Google Maps API Key', 'surecart')}
								placeholder={__(
									'Google Maps API Key',
									'surecart'
								)}
								onScInput={(e) =>
									setGoogleMapApiKey(e.target.value)
								}
								type="password"
								help={__(
									'Restrict this key by HTTP referrer in Google Cloud Console to prevent unauthorized usage.',
									'surecart'
								)}
							></ScInput>
							{!googleMapApiKey && (
								<ScAlert open>
									{__(
										'To use Google Maps features, you need an API key.',
										'surecart'
									)}{' '}
									<a
										href="https://console.cloud.google.com/apis/credentials"
										target="_blank"
										rel="noopener noreferrer"
									>
										{__(
											'Get your API key from Google Cloud Platform',
											'surecart'
										)}
									</a>
									<p>
										{__(
											'Create a new project and enable the Places, Geocoding, and Geolocation API for it. Then, create a new API key and add it here.',
											'surecart'
										)}
									</p>
								</ScAlert>
							)}
						</>
					)}
				</SettingsBox>
				<SettingsBox
					title={__('Shipping Profiles', 'surecart')}
					description={__(
						'Set where you ship and how much you charge for shipping.',
						'surecart'
					)}
					loading={loading}
					wrapperTag="div"
					noButton
				>
					<ScCard>
						<div
							css={css`
								display: grid;
								gap: var(--sc-spacing-large);
								--sc-input-label-margin: var(
									--sc-spacing-small
								);
							`}
						>
							{!!defaultShippingProfile && (
								<ScCard noPadding>
									<ShippingProfileListItem
										style={{
											'--sc-list-row-background-color':
												'var(--sc-color-brand-main-background)',
										}}
										shippingProfile={defaultShippingProfile}
										productsCount={
											shippingProfiles?.length
												? __(
														'All products not in other profiles',
														'surecart'
												  )
												: __('All products', 'surecart')
										}
									/>
								</ScCard>
							)}
							<ScFormControl
								label={__(
									'Custom Shipping Profiles',
									'surecart'
								)}
							>
								<div
									css={css`
										display: grid;
										gap: var(--sc-spacing-large);
									`}
								>
									{!!shippingProfiles?.length && (
										<ScCard noPadding>
											<ScStackedList>
												{shippingProfiles.map(
													(shippingProfile) => (
														<ShippingProfileListItem
															key={
																shippingProfile.id
															}
															shippingProfile={
																shippingProfile
															}
														/>
													)
												)}
											</ScStackedList>
										</ScCard>
									)}
									<ScCard noPadding>
										<ScEmpty>
											{upgradeRequired() && (
												<ScPremiumTag />
											)}
											{__(
												'Add custom rates or destination restrictions for groups of products.',
												'surecart'
											)}
											<ScUpgradeRequired
												required={upgradeRequired()}
											>
												<ScButton
													onClick={() =>
														setShowAddShipping(true)
													}
												>
													<ScIcon
														name="plus"
														slot="prefix"
													/>
													{__(
														'Add New Profile',
														'surecart'
													)}
												</ScButton>
											</ScUpgradeRequired>
										</ScEmpty>
									</ScCard>
								</div>
							</ScFormControl>
						</div>
					</ScCard>
				</SettingsBox>
				<ShippingMethods />
				<ParcelTemplates />
			</SettingsTemplate>
			<AddShippingProfile
				open={showAddShipping}
				onRequestClose={() => setShowAddShipping(false)}
			/>
		</Fragment>
	);
};
