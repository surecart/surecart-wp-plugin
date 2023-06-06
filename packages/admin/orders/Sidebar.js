import Address from './modules/Address';
import Customer from './modules/Customer';
import Phone from './modules/Phone';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ order, checkout, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} loading={loading} />
			{checkout?.phone && (
				<Phone
					phone={checkout?.phone}
					label={__('Phone', 'surecart')}
					loading={loading}
				/>
			)}
			<Purchases checkoutId={checkout?.id} />
			{!!checkout?.shipping_address && (
				<Address
					address={checkout?.shipping_address}
					label={__('Shipping & Tax Address', 'surecart')}
				/>
			)}
			{!!checkout?.tax_identifier && (
				<TaxInfo
					taxIdentifier={checkout?.tax_identifier}
					loading={loading}
				/>
			)}
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
