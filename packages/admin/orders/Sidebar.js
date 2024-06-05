import Customer from './modules/Customer';
import Phone from './modules/Phone';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ViewAddress from '../components/address/ViewAddress';

export default ({ setModal, order, checkout, customer, loading, modals }) => {
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

			<ViewAddress
				title={__('Shipping & Tax Address', 'surecart')}
				loading={loading}
				address={checkout?.shipping_address}
				onEditAddress={() => setModal(modals.EDIT_SHIPPING_ADDRESS)}
				onDeleteAddress={() => setModal(modals.CONFIRM_DELETE_ADDRESS)}
			/>

			<ViewAddress
				title={__('Billing Address', 'surecart')}
				loading={loading}
				address={checkout?.billing_address}
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
