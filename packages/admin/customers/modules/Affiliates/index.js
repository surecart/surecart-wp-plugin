/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import ConnectAffiliate from './ConnectAffiliate';
import ViewAffiliate from './ViewAffiliate';

export default ({ customer, updateCustomer, loading }) => {
	return (
		<Box title={__('Affiliate Commissions', 'surecart')} loading={loading}>
			{!customer?.affiliation?.id ? (
				<ConnectAffiliate
					customer={customer}
					updateCustomer={updateCustomer}
				/>
			) : (
				<ViewAffiliate
					customer={customer}
					updateCustomer={updateCustomer}
				/>
			)}
		</Box>
	);
};
