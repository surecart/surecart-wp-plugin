/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScButton,
	ScCard,
	ScEmpty,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScText,
} from '@surecart/components-react';
import { Fragment, useState } from '@wordpress/element';
import AddShippingZone from './AddShippingZone';
import EditShippingZone from './EditShippingZone';
import AddShippingMethod from './AddShippingMethod';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

const modals = {
	EDIT_ZONE: 'edit_shipping_zone',
	ADD_ZONE: 'add_shipping_zone',
	ADD_RATE: 'add_shipping_rate',
};

export default ({ shippingProfileId }) => {
	const [currentModal, setCurrentModal] = useState('');
	const [selectedZone, setSelectedZone] = useState();
	const { shippingZones, loading } = useSelect((select) => {
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

		const shippingZones = (
			select(coreStore).getEntityRecords(...queryArgs) || []
		).filter(
			(shippingZone) =>
				shippingZone.shipping_profile === shippingProfileId
		);

		return {
			shippingZones,
			loading: loading && !shippingZones?.length,
		};
	});

	const renderShippingRates = (shippingRates) => {
		if (!shippingRates?.data?.length) {
			return (
				<ScEmpty>{__('No shipping rates present', 'surecart')}</ScEmpty>
			);
		}

		return (
			<ScTable>
				<ScTableCell slot="head">{__('Name', 'surecart')}</ScTableCell>
				<ScTableCell slot="head">
					{__('Condition', 'surecart')}
				</ScTableCell>
				<ScTableCell slot="head">{__('Price', 'surecart')}</ScTableCell>
				<ScTableCell slot="head"></ScTableCell>
				{shippingRates?.data?.map((shippingRate) => (
					<ScTableRow href="#" key={shippingRate.id}>
						<ScTableCell>
							{shippingRate.shipping_method?.name}
						</ScTableCell>
						<ScTableCell>
							{renderCondition(shippingRate)}
						</ScTableCell>
						<ScTableCell>
							<ScFormatNumber
								value={shippingRate.amount}
								type="currency"
								currency={shippingRate.currency}
							/>
						</ScTableCell>
						<ScTableCell></ScTableCell>
					</ScTableRow>
				))}
			</ScTable>
		);
	};

	const renderCondition = (shippingRate) => {
		if (shippingRate.rate_type === 'amount') {
			return (
				<Fragment>
					<ScFormatNumber
						value={shippingRate.min_amount}
						type="currency"
						currency={shippingRate.currency}
					/>{' '}
					-{' '}
					<ScFormatNumber
						value={shippingRate.max_amount}
						type="currency"
						currency={shippingRate.currency}
					/>
				</Fragment>
			);
		}

		return `${shippingRate.min_amount}${shippingRate.weight_unit} - ${shippingRate.max_amount}${shippingRate.weight_unit}`;
	};

	console.log(shippingZones);

	return (
		<SettingsBox
			title={__('Shipping Zones', 'surecart')}
			end={
				<ScButton
					type="primary"
					onClick={() => setCurrentModal(modals.ADD_ZONE)}
				>
					<ScIcon name="plus" /> Create Zone
				</ScButton>
			}
			loading={loading}
			noButton
		>
			<ScFlex flexDirection="column">
				{!!shippingZones?.length ? (
					shippingZones.map((shippingZone) => (
						<ScCard key={shippingZone.id}>
							<ScFlex justifyContent="space-between">
								<strong>{shippingZone.name}</strong>
								<ScButton
									type="text"
									onClick={() => {
										setCurrentModal(modals.EDIT_ZONE);
										setSelectedZone(shippingZone);
									}}
								>
									Edit Zone
								</ScButton>
							</ScFlex>
							{renderShippingRates(shippingZone?.shipping_rates)}
							<ScButton
								onClick={() => {
									setCurrentModal(modals.ADD_RATE);
									setSelectedZone(shippingZone);
								}}
							>
								<ScIcon name="plus" /> Add Rate
							</ScButton>
						</ScCard>
					))
				) : (
					<ScText>No shipping zones present.</ScText>
				)}
			</ScFlex>

			<AddShippingZone
				open={currentModal === modals.ADD_ZONE}
				onRequestClose={() => setCurrentModal('')}
				shippingProfileId={shippingProfileId}
			/>
			<EditShippingZone
				open={currentModal === modals.EDIT_ZONE}
				onRequestClose={() => {
					setCurrentModal('');
					setSelectedZone();
				}}
				selectedZone={selectedZone}
				shippingProfileId={shippingProfileId}
			/>
			<AddShippingMethod
				open={currentModal === modals.ADD_RATE}
				onRequestClose={() => setCurrentModal('')}
				shippingZoneId={selectedZone?.id}
			/>
		</SettingsBox>
	);
};
