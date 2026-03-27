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

export default ({
	customerId,
	customerShippingAddress,
	customerBillingAddress,
	customerBillingMatchesShipping,
	open,
	onRequestClose,
}) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [shippingAddress, setShippingAddress] = useState(
		customerShippingAddress
	);
	const [billingAddress, setBillingAddress] = useState(
		customerBillingAddress
	);
	const [billingMatchesShipping, setBillingMatchesShipping] = useState(
		customerBillingMatchesShipping
	);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setShippingAddress(customerShippingAddress);
	}, [customerShippingAddress]);

	useEffect(() => {
		setBillingAddress(customerBillingAddress);
	}, [customerBillingAddress]);

	useEffect(() => {
		setBillingMatchesShipping(customerBillingMatchesShipping);
	}, [customerBillingMatchesShipping]);

	const onSubmit = async () => {
		try {
			setBusy(true);
			const customer = await apiFetch({
				path: addQueryArgs(`/surecart/v1/customers/${customerId}`, {
					expand: ['shipping_address', 'balances', 'billing_address'],
				}),
				method: 'PATCH',
				data: {
					shipping_address: shippingAddress,
					...(billingMatchesShipping
						? {}
						: { billing_address: billingAddress }),
					billing_matches_shipping: billingMatchesShipping,
				},
			});
			receiveEntityRecords('surecart', 'customer', customer);
			createSuccessNotice(__('Address updated.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	const hasAnyAddress = !!shippingAddress?.id || !!billingAddress?.id;

	return (
		<EditAddress
			open={open}
			onRequestClose={onRequestClose}
			title={
				hasAnyAddress
					? __('Update Address', 'surecart')
					: __('Add Address', 'surecart')
			}
			buttonText={
				hasAnyAddress
					? __('Update', 'surecart')
					: __('Save Address', 'surecart')
			}
			shippingAddress={shippingAddress}
			setShippingAddress={setShippingAddress}
			billingAddress={billingAddress}
			setBillingAddress={setBillingAddress}
			billingMatchesShipping={billingMatchesShipping}
			setBillingMatchesShipping={setBillingMatchesShipping}
			onSubmit={onSubmit}
			error={error}
			setError={setError}
			busy={busy}
		/>
	);
};
