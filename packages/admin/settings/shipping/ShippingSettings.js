/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import SettingsTemplate from '../SettingsTemplate';
import {
	ScAlert,
	ScButton,
	ScCard,
	ScEmpty,
	ScFormControl,
	ScIcon,
	ScStackedList,
	ScSwitch,
} from '@surecart/components-react';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import AddShippingProfile from './profile/AddShippingProfile';
import useEntity from '../../hooks/useEntity';
import ShippingMethods from './method/ShippingMethods';
import useSave from '../UseSave';
import ShippingProfileListItem from './profile/ShippingProfileListItem';

export default () => {
	const [error, setError] = useState(null);
	const [showAddShipping, setShowAddShipping] = useState(false);
	const { save } = useSave();

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

	const onToggleShipping = (e) => {
		e.preventDefault();
		editShippingProtocol({
			shipping_enabled: !shippingProtocol?.shipping_enabled,
		});
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
				{!loading && !hasZones && shippingProtocol?.shipping_enabled && (
					<ScAlert
						type="warning"
						open
						title={__('No shipping rates', 'surecart')}
					>
						{__(
							"Customers won't be able to complete checkout for physical products. Please add shipping rates.",
							'surecart'
						)}
					</ScAlert>
				)}
				<SettingsBox
					loading={!hasLoadedShippingProtocol}
					title={__('Shipping Settings', 'surecart')}
					description={__(
						'Turning on shipping allows you to restrict purchase areas and charge shipping costs.',
						'surecart'
					)}
				>
					<ScSwitch
						checked={shippingProtocol?.shipping_enabled}
						onClick={onToggleShipping}
					>
						{__('Enable Shipping', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'When disabled, all shipping costs will be zero and shipping will not be available.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</SettingsBox>
				{shippingProtocol?.shipping_enabled && (
					<>
						{}
						<SettingsBox
							title={__('Shipping', 'surecart')}
							description={__(
								'Choose where you ship and how much you charge for shipping at checkout',
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
										<ScFormControl
											label={__(
												'General shipping rates',
												'surecart'
											)}
										>
											<ScCard noPadding>
												<ShippingProfileListItem
													style={{
														'--sc-list-row-background-color':
															'var(--sc-color-brand-main-background)',
													}}
													shippingProfile={
														defaultShippingProfile
													}
													productsCount={
														shippingProfiles?.length
															? __(
																	'All products not in other profiles',
																	'surecart'
															  )
															: __(
																	'All products',
																	'surecart'
															  )
													}
												/>
											</ScCard>
										</ScFormControl>
									)}
									<ScFormControl
										label={__(
											'Custom shipping rates',
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
															(
																shippingProfile
															) => (
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
													{__(
														'Add custom rates or destination restrictions for groups of products.',
														'surecart'
													)}
													<ScButton
														onClick={() =>
															setShowAddShipping(
																true
															)
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
												</ScEmpty>
											</ScCard>
										</div>
									</ScFormControl>
								</div>
							</ScCard>
						</SettingsBox>
						<ShippingMethods />
					</>
				)}
			</SettingsTemplate>
			<AddShippingProfile
				open={showAddShipping}
				onRequestClose={() => setShowAddShipping(false)}
			/>
		</Fragment>
	);
};
