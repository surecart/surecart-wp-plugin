import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScButton, ScFlex } from '@surecart/components-react';
import { countryChoices } from '@surecart/components';
import AddressDisplay from '../../../components/AddressDisplay';

export default ({ onEditAddress, shippingAddress, loading }) => {
	return (
		<Box title={__('Shipping & Tax Address', 'surecart')} loading={loading}>
			<ScFlex>
				<ScFlex
					flexDirection="column"
					style={{ gap: 'var(--sc-spacing-x-small)' }}
				>
					<AddressDisplay address={shippingAddress} />
				</ScFlex>
				<ScButton size="small" onClick={onEditAddress}>
					{__('Edit', 'surecart')}
				</ScButton>
			</ScFlex>
		</Box>
	);
};
