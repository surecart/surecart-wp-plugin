import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';

export default ({ loading }) => {
	return (
		<Box title={__('Summary', 'checkout_engine')} loading={loading}>
			Summary
		</Box>
	);
};
