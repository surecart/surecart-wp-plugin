/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import AddressDisplay from '../../components/AddressDisplay';

export default ({ checkout, loading }) => {
	if (!checkout?.geo_address?.formatted_string) {
		return null;
	}

	return (
		<Box title={__('Captured Location', 'surecart')} loading={loading}>
			<AddressDisplay address={checkout?.geo_address?.formatted_string} />
		</Box>
	);
};
