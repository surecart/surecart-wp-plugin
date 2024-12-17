/**
 * External dependencies.
 */
import { Fragment, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
/**
 * Internal dependencies.
 */
import ContactInfo from './modules/ContactInfo';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import ViewAddress from '../components/address/ViewAddress';
import EditAddressModal from './modules/EditAddressModal';
import Confirm from '../components/confirm';
import { checkoutOrderExpands } from '../util/orders';
import InvoiceDetails from './modules/InvoiceDetails';

const modals = {
	EDIT_ADDRESS: 'EDIT_ADDRESS',
	CONFIRM_DELETE_ADDRESS: 'CONFIRM_DELETE_ADDRESS',
};

export default ({ order, checkout, loading, onManuallyRefetchOrder }) => {
	const [modal, setModal] = useState('');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const deleteConfirmMessage = __(
		'Are you sure? This cannot be undone.',
		'surecart'
	);

	const onDeleteAddress = async () => {
		try {
			setSaving(true);
			const checkout = await apiFetch({
				path: addQueryArgs(
					`/surecart/v1/checkouts/${order?.checkout?.id}`,
					{
						expand: checkoutOrderExpands,
					}
				),
				method: 'PATCH',
				data: {
					shipping_address: {},
					billing_matches_shipping: true,
					billing_address: {},
				},
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(__('Address deleted.', 'surecart'), {
				type: 'snackbar',
			});
			setModal('');
		} catch (e) {
			setError(e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Fragment>
			<InvoiceDetails checkout={checkout} loading={loading} />
			<ContactInfo
				checkout={checkout}
				loading={loading}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
			<ViewAddress
				title={__('Address', 'surecart')}
				loading={loading}
				shippingAddress={checkout?.shipping_address}
				billingAddress={checkout?.billing_address}
				billingMatchesShipping={checkout?.billing_matches_shipping}
				onEditAddress={() => setModal(modals.EDIT_ADDRESS)}
				onDeleteAddress={() => setModal(modals.CONFIRM_DELETE_ADDRESS)}
			/>
			<TaxInfo
				checkout={checkout}
				loading={loading}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
			<Purchases checkoutId={checkout?.id} />
			<MetaData order={order} loading={loading} />
			<EditAddressModal
				open={modal === modals.EDIT_ADDRESS}
				checkoutShippingAddress={checkout?.shipping_address}
				checkoutBillingAddress={checkout?.billing_address}
				checkoutBillingMatchesShipping={
					checkout?.billing_matches_shipping
				}
				onRequestClose={() => setModal('')}
				checkoutId={checkout?.id}
			/>
			<Confirm
				open={modal === modals.CONFIRM_DELETE_ADDRESS}
				onRequestClose={() => setModal('')}
				onConfirm={onDeleteAddress}
				loading={saving}
				error={error}
			>
				{deleteConfirmMessage}
			</Confirm>
		</Fragment>
	);
};
