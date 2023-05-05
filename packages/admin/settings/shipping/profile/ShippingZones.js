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

export default ({ shippingProfileId, shippingZones, loading }) => {
	const [showAddZone, setShowAddZone] = useState(false);
	const [selectedZone, setSelectedZone] = useState();
	const [showEditZone, setShowEditZone] = useState();

	return (
		<SettingsBox
			title={__('Shipping Zones', 'surecart')}
			end={
				<ScButton type="primary" onClick={() => setShowAddZone(true)}>
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
										setShowEditZone(true);
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
						</ScCard>
					))
				) : (
					<ScText>No shipping zones present.</ScText>
				)}
			</ScFlex>
			<ScButton>
				<ScIcon name="plus" /> Add Rate
			</ScButton>
			<AddShippingZone
				open={showAddZone}
				onRequestClose={() => setShowAddZone(false)}
				shippingProfileId={shippingProfileId}
			/>
			<EditShippingZone
				open={showEditZone}
				onRequestClose={() => {
					setShowEditZone(false);
					setSelectedZone();
				}}
				selectedZone={selectedZone}
				shippingProfileId={shippingProfileId}
			/>
		</SettingsBox>
	);
};
