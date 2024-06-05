/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import AddressModal from '../../../components/address/AddressModal';

export default ({ checkoutId, billingAddress, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [address, setAddress] = useState(billingAddress);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		setAddress(billingAddress);
	}, [billingAddress]);

	const isEdit = () => !!billingAddress?.id;

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const checkout = await apiFetch({
				path: addQueryArgs(`/surecart/v1/checkouts/${checkoutId}`, {
					expand: [
						'order',
						'order.checkout',
						'checkout.charge',
						'checkout.customer',
						'checkout.tax_identifier',
						'checkout.payment_failures',
						'checkout.shipping_address',
						'checkout.billing_address',
						'checkout.discount',
						'checkout.line_items',
						'checkout.selected_shipping_choice',
						'shipping_choice.shipping_method',
						'discount.promotion',
						'line_item.price',
						'line_item.fees',
						'line_item.variant',
						'customer.balances',
						'price.product',
						'product.featured_product_media',
						'product_media.media',
						'variant.image',
					],
				}),
				method: 'PATCH',
				data: {
					billing_matches_shipping: false,
					billing_address: address,
				},
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(__('Billing Address Updated', 'surecart'), {
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
		<AddressModal
			isEdit={isEdit}
			title={
				isEdit()
					? __('Update Shipping Address', 'surecart')
					: __('Add Shipping Address', 'surecart')
			}
			open={open}
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
