/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import ConfirmDeleteAddressModal from '../../../components/address/ConfirmDeleteAddressModal';
import { checkoutOrderExpands } from '../../../util/orders';

export default ({ checkoutId, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const checkout = await apiFetch({
				path: addQueryArgs(`/surecart/v1/checkouts/${checkoutId}`, {
					expand: checkoutOrderExpands,
				}),
				method: 'PATCH',
				data: {
					shipping_address: {},
				},
			});
			receiveEntityRecords('surecart', 'order', checkout.order);
			createSuccessNotice(__('Shipping Address Deleted', 'surecart'), {
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
		<ConfirmDeleteAddressModal
			open={open}
			onRequestClose={onRequestClose}
			onEditAddress={onEditAddress}
			error={error}
			setError={setError}
			busy={busy}
			title={__('Delete Shipping Address', 'surecart')}
			description={__(
				'Are you sure you want to delete address? This action cannot be undone.',
				'surecart'
			)}
		/>
	);
};
