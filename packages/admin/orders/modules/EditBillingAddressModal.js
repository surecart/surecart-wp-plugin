/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import EditAddress from '../../components/address/EditAddress';
import { checkoutOrderExpands } from '../../util/orders';

export default ({ checkoutId, billingAddress, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [address, setAddress] = useState(billingAddress);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setAddress(billingAddress);
	}, [billingAddress]);

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const checkout = await apiFetch({
				path: addQueryArgs(`/surecart/v1/checkouts/${checkoutId}`, {
					expand: checkoutOrderExpands,
				}),
				method: 'PATCH',
				data: {
					billing_matches_shipping: false,
					billing_address: address,
				},
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(__('Billing address updated.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<EditAddress
			open={open}
			onRequestClose={onRequestClose}
			isEdit={!!billingAddress?.id}
			title={
				!!billingAddress?.id
					? __('Update Billing Address', 'surecart')
					: __('Add Billing Address', 'surecart')
			}
			buttonText={
				!!billingAddress?.id
					? __('Update', 'surecart')
					: __('Save', 'surecart')
			}
			address={address}
			setAddress={setAddress}
			error={error}
			setError={setError}
			onEditAddress={onEditAddress}
			onRequestClose={onRequestClose}
			busy={busy}
		/>
	);
};
