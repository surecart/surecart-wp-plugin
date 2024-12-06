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

export default ({
	checkoutId,
	checkoutShippingAddress,
	checkoutBillingAddress,
	checkoutBillingMatchesShipping,
	open,
	onRequestClose,
}) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [shippingAddress, setShippingAddress] = useState(
		checkoutShippingAddress
	);
	const [billingAddress, setBillingAddress] = useState(
		checkoutBillingAddress
	);
	const [billingMatchesShipping, setBillingMatchesShipping] = useState(
		checkoutBillingMatchesShipping
	);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setShippingAddress(checkoutShippingAddress);
	}, [checkoutShippingAddress]);

	useEffect(() => {
		setBillingAddress(checkoutBillingAddress);
	}, [checkoutBillingAddress]);

	useEffect(() => {
		setBillingMatchesShipping(checkoutBillingMatchesShipping);
	}, [checkoutBillingMatchesShipping]);

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const checkout = await apiFetch({
				path: addQueryArgs(`/surecart/v1/draft-checkouts/${checkoutId}`, {
					expand: checkoutOrderExpands,
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
			receiveEntityRecords('surecart', 'order', checkout.order);
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
			error={error}
			setError={setError}
			onSubmit={onEditAddress}
			busy={busy}
		/>
	);
};
