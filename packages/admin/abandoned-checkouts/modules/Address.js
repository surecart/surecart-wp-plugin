import AddressDisplay from '../../components/AddressDisplay';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';

export default ({ address = {}, label, loading }) => {
	if (!loading && !address?.id) {
		return null;
	}
	return (
		<Box title={label || __('Address', 'surecart')} loading={loading}>
			<AddressDisplay address={address} />
		</Box>
	);
};
