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
import { checkoutOrderExpands } from '../../../util/orders';
import Confirm from '../../../components/confirm';

export default ({ checkoutId, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onDelete = async () => {
		try {
			setDeleting(true);
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
			setDeleting(false);
		}
	};

	return (
		<Confirm
			open={open}
			onRequestClose={onRequestClose}
			onConfirm={onDelete}
			loading={deleting}
			error={error}
		>
			{__('Are you sure? This cannot be undone.', 'surecart')}
		</Confirm>
	);
};
