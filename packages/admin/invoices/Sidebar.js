import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Address from './modules/Address';
import Customer from './modules/Customer';
import Purchases from './modules/Purchases';

export default ({ invoice, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} isLoading={loading} />
			<Purchases />
			{invoice?.shipping_address && (
				<Address
					address={invoice?.shipping_address}
					label={__('Shipping Address', 'surecart')}
				/>
			)}
		</Fragment>
	);
};
