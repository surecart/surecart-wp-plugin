/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import { ScButton, ScFlex, ScIcon, ScText } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ShippingZone from './ShippingZone';
import ShippingZoneForm from './ShippingZoneForm';

const modals = {
	EDIT_ZONE: 'edit_shipping_zone',
	ADD_ZONE: 'add_shipping_zone',
};

export default ({ shippingProfileId, fallbackZoneId }) => {
	const [currentModal, setCurrentModal] = useState('');
	const [selectedZone, setSelectedZone] = useState();

	const { shippingZones, loading, busy } = useSelect((select) => {
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
			busy: loading && !!shippingZones?.length,
		};
	});

	return (
		<SettingsBox
			title={__('Shipping Zones', 'surecart')}
			end={
				<ScButton
					type="primary"
					onClick={() => setCurrentModal(modals.ADD_ZONE)}
				>
					<ScIcon name="plus" /> {__('Create Zone', 'surecart')}
				</ScButton>
			}
			loading={loading}
			noButton
		>
			<ScFlex flexDirection="column">
				{!!shippingZones?.length ? (
					shippingZones.map((shippingZone) => (
						<ShippingZone
							key={shippingZone.id}
							shippingZone={shippingZone}
							onEditZone={() => {
								setCurrentModal(modals.EDIT_ZONE);
								setSelectedZone(shippingZone);
							}}
							parentBusy={
								busy && selectedZone?.id === shippingZone.id
							}
							isFallback={shippingZone?.id === fallbackZoneId}
						/>
					))
				) : (
					<ScEmpty icon="map">
						{__('No shipping zones present.', 'surecart')}
					</ScEmpty>
				)}
			</ScFlex>

			<ShippingZoneForm
				open={
					currentModal === modals.ADD_ZONE ||
					currentModal === modals.EDIT_ZONE
				}
				onRequestClose={() => setCurrentModal('')}
				shippingProfileId={shippingProfileId}
				selectedZone={selectedZone}
				isEdit={currentModal === modals.EDIT_ZONE}
			/>
		</SettingsBox>
	);
};
