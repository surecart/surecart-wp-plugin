import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

const expand = ['order'];

export default ({ order, open, onRequestClose, hasLoading }) => {
	const [loading, setLoading] = useState(hasLoading);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const markAsPaid = async () => {
		try {
			setLoading(true);
			setError(null);
			const checkout = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/checkouts/${order?.checkout?.id}/manually_pay`,
					{
						expand,
					}
				),
				data: {
					purge_pending_update: true,
				},
			});

			// refetch entities.
			invalidateResolutionForStore();

			receiveEntityRecords('surecart', 'order', {
				...order,
				status: checkout?.status,
			});

			createSuccessNotice(__('Order Marked as Paid.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			label={__('Confirm', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<ScAlert open={error} type="error">
				{error}
			</ScAlert>
			{__('Are you sure you wish to mark the order as paid?', 'surecart')}
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Cancel', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={() => markAsPaid()}
					disabled={loading}
				>
					{__('Mark Paid', 'surecart')}
				</ScButton>
			</div>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
