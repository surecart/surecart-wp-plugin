import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScButton,
	ScFlex,
	ScIcon,
	ScBlockUi,
	ScAlert,
	ScCard,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import ShippingZone from './ShippingZone';
import ShippingZoneForm from './ShippingZoneForm';

const modals = {
	EDIT_ZONE: 'edit_shipping_zone',
	ADD_ZONE: 'add_shipping_zone',
};

export default ({
	shippingProfileId,
	shippingZones,
	fallbackZoneId,
	loading,
	fetching,
}) => {
	const [currentModal, setCurrentModal] = useState('');
	const [selectedZone, setSelectedZone] = useState();

	return (
		<>
			<SettingsBox
				title={__('Shipping Zones', 'surecart')}
				description={__(
					'Shipping zones are geographic regions where you ship products.',
					'surecart'
				)}
				end={
					<ScButton
						type="primary"
						onClick={() => setCurrentModal(modals.ADD_ZONE)}
					>
						<ScIcon name="plus" slot="prefix" />
						{__('Create Zone', 'surecart')}
					</ScButton>
				}
				loading={loading}
				noButton
				wrapperTag="div"
			>
				<ScCard>
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
									parentBusy={fetching}
									isFallback={
										shippingZone.id === fallbackZoneId
									}
								/>
							))
						) : (
							<ScAlert
								type="warning"
								open
								title={__(
									'No shipping zones or rates',
									'surecart'
								)}
							>
								{__(
									"Customers won't be able to complete checkout for products in this profile.",
									'surecart'
								)}
							</ScAlert>
						)}
					</ScFlex>
					{fetching && <ScBlockUi spinner />}
				</ScCard>
			</SettingsBox>

			{currentModal && (
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
			)}
		</>
	);
};
