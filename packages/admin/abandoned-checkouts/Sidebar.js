import Address from './modules/Address';
import Customer from './modules/Customer';
import MetaData from './modules/MetaData';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ order, checkout, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} loading={loading} />
			{!!checkout?.shipping_address && (
				<Address
					address={checkout?.shipping_address}
					label={__('Shipping & Tax Address', 'surecart')}
				/>
			)}
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
