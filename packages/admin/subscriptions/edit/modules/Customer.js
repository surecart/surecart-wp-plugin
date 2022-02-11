import { __ } from '@wordpress/i18n';
import useEntity from '../../../mixins/useEntity';
import Box from '../../../ui/Box';

export default ({ subscription, loading }) => {
	const { customer } = useEntity('customer', subscription?.customer);

	return (
		<Box title={__('Customer', 'checkout_engine')} loading={loading}>
			{customer?.email}
		</Box>
	);
};
