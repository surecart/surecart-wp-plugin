import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScButton, ScFlex } from '@surecart/components-react';
import { countryChoices } from '@surecart/components';

export default ({ onEditAddress, shippingAddress, loading }) => {
	return (
		<Box title={__('Shipping & Tax Address', 'surecart')} loading={loading}>
			<ScFlex>
				<ScFlex
					flexDirection="column"
					style={{ gap: 'var(--sc-spacing-x-small)' }}
				>
					<span>
						{shippingAddress?.line_1}{' '}
						{shippingAddress?.line_2 &&
							` / ${shippingAddress?.line_2}`}
					</span>
					<span>
						{shippingAddress?.city}
						{shippingAddress?.state &&
							`$ - ${shippingAddress?.state}`}
					</span>
					<span>{shippingAddress?.postal_code}</span>
					<span>
						{
							countryChoices.find(
								(countryChoice) =>
									countryChoice.value ===
									shippingAddress?.country
							)?.label
						}
					</span>
				</ScFlex>
				<ScButton size="small" onClick={onEditAddress}>
					Edit
				</ScButton>
			</ScFlex>
		</Box>
	);
};
