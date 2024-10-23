import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import EditAddress from '../../../components/address/EditAddress';

export default ({ customerId, billingAddress, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [address, setAddress] = useState(billingAddress);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setAddress(billingAddress);
	}, [billingAddress]);

	const onSubmit = async () => {
		try {
			setBusy(true);
			const customer = await apiFetch({
				path: addQueryArgs(`/surecart/v1/customers/${customerId}`, {
					expand: ['shipping_address', 'balances', 'billing_address'],
				}),
				method: 'PATCH',
				data: {
					billing_matches_shipping: false,
					billing_address: address,
				},
			});
			receiveEntityRecords('surecart', 'customer', customer);
			createSuccessNotice(__('Address Updated', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const isEdit = !!billingAddress?.id;

	return (
		<EditAddress
			open={open}
			onRequestClose={onRequestClose}
			title={
				isEdit
					? __('Update Billing Address', 'surecart')
					: __('Add Billing Address', 'surecart')
			}
			address={address}
			setAddress={setAddress}
			onSubmit={onSubmit}
			error={error}
			setError={setError}
			busy={busy}
		/>
	);
};
