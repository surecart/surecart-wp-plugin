/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScButton,
	ScCard,
	ScFlex,
	ScIcon,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScText,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import AddShippingZone from './AddShippingZone';
import EditShippingZone from './EditShippingZone';
import AddShippingMethod from './AddShippingMethod';

const modals = {
	EDIT_ZONE: 'edit_shipping_zone',
	ADD_ZONE: 'add_shipping_zone',
	ADD_RATE: 'add_shipping_rate',
};

export default ({ shippingProfileId, shippingZones, loading }) => {
	const [currentModal, setCurrentModal] = useState('');
	const [selectedZone, setSelectedZone] = useState();

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
						<ScCard>
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
							<ScTable>
								<ScTableCell slot="head">
									{__('Name', 'surecart')}
								</ScTableCell>
								<ScTableCell slot="head">
									{__('Condition', 'surecart')}
								</ScTableCell>
								<ScTableCell slot="head">
									{__('Price', 'surecart')}
								</ScTableCell>
								<ScTableCell slot="head"></ScTableCell>
								{shippingZone?.shipping_rates?.map(
									(shippingRate) => (
										<ScTableRow
											href="#"
											key={shippingRate.id}
										>
											<ScTableCell>
												{shippingRate.name}
											</ScTableCell>
											<ScTableCell>
												{shippingRate.condition}
											</ScTableCell>
											<ScTableCell>
												{shippingRate.price}
											</ScTableCell>
											<ScTableCell></ScTableCell>
										</ScTableRow>
									)
								)}
							</ScTable>
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
