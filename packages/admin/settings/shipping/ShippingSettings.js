/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import SettingsTemplate from '../SettingsTemplate';
import {
	ScButton,
	ScCard,
	ScEmpty,
	ScIcon,
	ScStackedList,
	ScStackedListRow,
	ScText,
} from '@surecart/components-react';
import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import AddShippingProfile from './AddShippingProfile';

export default () => {
	const [error, setError] = useState(null);
	const [showAddShipping, setShowAddShipping] = useState(false);
	const { shippingProfiles, loading, busy } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'shipping-profile',
			{
				context: 'edit',
				per_page: 100,
				expand: ['products', 'shipping_zones'],
			},
		];
		const items = select(coreStore).getEntityRecords(...queryArgs);
		const resolving = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);
		return {
			shippingProfiles: select(coreStore).getEntityRecords(...queryArgs),
			loading: !!(!items?.length && resolving),
			busy: !!(items?.length && resolving),
		};
	});

	return (
		<Fragment>
			<SettingsTemplate
				title={__('Shipping and Delivery', 'surecart')}
				icon={<ScIcon name="truck" />}
				noButton
			>
				<Error error={error} setError={setError} margin="80px" />
				<SettingsBox
					title={__('Shipping', 'surecart')}
					description={__(
						'Choose where you ship and how much you charge for shipping at checkout',
						'surecart'
					)}
					end={
						<ScButton
							type="primary"
							onClick={() => setShowAddShipping(true)}
						>
							<ScIcon name="plus" />
							Add New
						</ScButton>
					}
					loading={loading}
					wrapperTag="div"
					noButton
				>
					<ScCard noPadding style={{ overflow: 'hidden' }}>
						{shippingProfiles?.length ? (
							<ScStackedList>
								{shippingProfiles.map((shippingProfile) => (
									<ScStackedListRow
										key={shippingProfile.id}
										href={addQueryArgs(
											window.location.href,
											{
												type: 'shipping_profile',
												profile: shippingProfile.id,
											}
										)}
										style={{
											'--columns': '2',
										}}
									>
										<div>
											<strong>
												{shippingProfile.name}
											</strong>
											<div
												css={css`
													margin-top: var(
														--sc-spacing-medium
													);
												`}
											>
												{
													shippingProfile?.products
														?.pagination?.count
												}{' '}
												{__('Products', 'surecart')}
											</div>
										</div>
										<div>
											<strong>
												{__('Zones', 'surecart')}
											</strong>

											<ul
												css={css`
													list-style: none;
												`}
											>
												{shippingProfile?.shipping_zones
													?.data.length === 0 && (
													<li>
														{__(
															'0 zones',
															'surecart'
														)}
													</li>
												)}
												{shippingProfile?.shipping_zones?.data.map(
													(shippingZone) => (
														<li
															key={
																shippingZone.id
															}
														>
															{shippingZone.name}
														</li>
													)
												)}
											</ul>
										</div>
										<ScIcon
											name="chevron-right"
											slot="suffix"
										></ScIcon>
									</ScStackedListRow>
								))}
							</ScStackedList>
						) : (
							<ScEmpty icon="truck">
								{__('No shipping present')}
							</ScEmpty>
						)}
					</ScCard>
				</SettingsBox>
			</SettingsTemplate>
			<AddShippingProfile
				open={showAddShipping}
				onRequestClose={() => setShowAddShipping(false)}
			/>
		</Fragment>
	);
};
