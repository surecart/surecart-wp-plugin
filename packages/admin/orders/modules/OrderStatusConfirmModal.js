import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

const expand = [
	'order',
];

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const markAsPaid = async () => {
		try {
			setLoading(true);
			setError(null);
			const manuallyPay = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/checkouts/${id}/manually_pay`, {
					expand,
				}),
				data: {
					purge_pending_update: true,
				},
			});
			receiveEntityRecords('surecart', 'manually_pay', manuallyPay, {
				expand,
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
			{__(
				'Are you sure you wish to mark the order as paid?',
				'surecart'
			)}
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__("Don't mark paid", 'surecart')}
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
