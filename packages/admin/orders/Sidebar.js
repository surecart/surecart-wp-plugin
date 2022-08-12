import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Address from './modules/Address';
import Customer from './modules/Customer';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';

export default ({ order, updateOrder, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} isLoading={loading} />
			<Purchases />
			{order?.shipping_address && (
				<Address
					address={order?.shipping_address}
					label={__('Shipping Address', 'surecart')}
				/>
			)}
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
