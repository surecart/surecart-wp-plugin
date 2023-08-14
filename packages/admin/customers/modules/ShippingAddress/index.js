import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScButton, ScEmpty, ScFlex } from '@surecart/components-react';
import AddressDisplay from '../../../components/AddressDisplay';

export default ({ onEditAddress, shippingAddress, loading }) => {
	return (
		<Box title={__('Shipping & Tax Address', 'surecart')} loading={loading}>
			{!!shippingAddress?.id ? (
				<ScFlex>
					<AddressDisplay address={shippingAddress} />
					<ScButton size="small" onClick={onEditAddress}>
						{__('Edit', 'surecart')}
					</ScButton>
				</ScFlex>
			) : (
				<ScEmpty>
					{__('Shipping address is not set.', 'surecart')}
					<ScButton size="small" onClick={onEditAddress}>
						{__('Edit', 'surecart')}
					</ScButton>
				</ScEmpty>
			)}
		</Box>
	);
};
