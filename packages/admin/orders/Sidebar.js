import Address from './modules/Address';
import Customer from './modules/Customer';
import Phone from './modules/Phone';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import BillingAddress from './modules/BillingAddress';
import ShippingAddress from './modules/ShippingAddress';

export default ({
	modal,
	setModal,
	order,
	checkout,
	customer,
	loading,
	modals,
}) => {
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
			<ShippingAddress
				shippingAddress={checkout?.shipping_address}
				loading={loading}
				onEditAddress={() => setModal(modals.EDIT_SHIPPING_ADDRESS)}
				onDeleteAddress={() => setModal(modals.CONFIRM_DELETE_ADDRESS)}
			/>

			<BillingAddress
				billingAddress={checkout?.billing_address}
				loading={loading}
				onEditAddress={() => setModal(modals.EDIT_BILLING_ADDRESS)}
				onDeleteAddress={() =>
					setModal(modals.CONFIRM_DELETE_BILLING_ADDRESS)
				}
			/>

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
