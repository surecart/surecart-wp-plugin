import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import Address from './modules/Address';
import Customer from './modules/Customer';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';

export default ({ order, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} loading={loading} />
			<Purchases checkoutId={order?.checkout?.id} />
			{!!order?.shipping_address && (
				<Address
					address={order?.shipping_address}
					label={__('Shipping Address', 'surecart')}
				/>
			)}
			{!!order?.checkout?.tax_identifier && (
				<TaxInfo
					taxIdentifier={order?.checkout?.tax_identifier}
					loading={loading}
				/>
			)}
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
