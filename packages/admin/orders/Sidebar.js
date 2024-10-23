/**
 * External dependencies.
 */
import { Fragment, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import ContactInfo from './modules/ContactInfo';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';
import TaxInfo from './modules/TaxInfo';
import ViewAddress from '../components/address/ViewAddress';
import EditShippingAddressModal from './modules/EditShippingAddressModal';
import EditBillingAddressModal from './modules/EditBillingAddressModal';
import Confirm from '../components/confirm';
import { checkoutOrderExpands } from '../util/orders';

const modals = {
	EDIT_SHIPPING_ADDRESS: 'EDIT_SHIPPING_ADDRESS',
	CONFIRM_DELETE_ADDRESS: 'CONFIRM_DELETE_ADDRESS',
	EDIT_BILLING_ADDRESS: 'EDIT_BILLING_ADDRESS',
	CONFIRM_DELETE_BILLING_ADDRESS: 'CONFIRM_DELETE_BILLING_ADDRESS',
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

	const onDeleteAddress = async (data, successMessage) => {
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
				data,
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(successMessage, {
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
			<ContactInfo
				checkout={checkout}
				loading={loading}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
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

			<EditShippingAddressModal
				open={modal === modals.EDIT_SHIPPING_ADDRESS}
				shippingAddress={checkout?.shipping_address}
				onRequestClose={() => setModal('')}
				checkoutId={checkout?.id}
			/>

			<Confirm
				open={modal === modals.CONFIRM_DELETE_ADDRESS}
				onRequestClose={() => setModal('')}
				onConfirm={() =>
					onDeleteAddress(
						{
							shipping_address: {},
						},
						__('Shipping address deleted.', 'surecart')
					)
				}
				loading={saving}
				error={error}
			>
				{deleteConfirmMessage}
			</Confirm>

			<EditBillingAddressModal
				open={modal === modals.EDIT_BILLING_ADDRESS}
				billingAddress={checkout?.billing_address}
				onRequestClose={() => setModal('')}
				checkoutId={checkout?.id}
			/>

			<Confirm
				open={modal === modals.CONFIRM_DELETE_BILLING_ADDRESS}
				onRequestClose={() => setModal('')}
				onConfirm={() =>
					onDeleteAddress(
						{
							billing_matches_shipping: false,
							billing_address: {},
						},
						__('Billing address deleted.', 'surecart')
					)
				}
				loading={saving}
				error={error}
			>
				{deleteConfirmMessage}
			</Confirm>
		</Fragment>
	);
};
