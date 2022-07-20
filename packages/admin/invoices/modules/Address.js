import { __ } from '@wordpress/i18n';
import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';

export default ({ address = {}, label, loading }) => {
	return (
		<Box title={label || __('Address', 'surecart')} loading={loading}>
			<AddressDisplay address={address} />
		</Box>
	);
};
