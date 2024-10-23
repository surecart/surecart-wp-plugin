import Address from './modules/Address';
import ContactInfo from './modules/ContactInfo';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ order, checkout, loading, onManuallyRefetchOrder }) => {
	return (
		<Fragment>
			<ContactInfo
				checkout={checkout}
				loading={loading}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
			{!!checkout?.shipping_address && (
				<Address
					address={checkout?.shipping_address}
					label={__('Shipping & Tax Address', 'surecart')}
				/>
			)}
			{!!checkout?.billing_address_display && (
				<Address
					address={checkout?.billing_address_display}
					label={__('Billing Address', 'surecart')}
				/>
			)}
			{!!checkout?.tax_identifier && (
				<TaxInfo
					taxIdentifier={checkout?.tax_identifier}
					loading={loading}
				/>
			)}
			<Purchases checkoutId={checkout?.id} />
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
