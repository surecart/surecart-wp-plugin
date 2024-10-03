/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import Error from '../../components/Error';

export default ({ open, onRequestClose }) => {
	const { loading, invoice, receiveInvoice, checkoutExpands } = useInvoice();
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const markAsPaid = async () => {
		try {
			setBusy(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const checkoutUpdated = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`${baseURL}/${invoice?.checkout?.id}/manually_pay`,
					{
						expand: checkoutExpands,
					}
				),
			});

			receiveInvoice({
				...invoice,
				status: checkoutUpdated?.status,
				checkout: checkoutUpdated,
			});

			createSuccessNotice(__('Invoice marked as paid.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={markAsPaid}
			onCancel={onRequestClose}
			confirmButtonText={__('Mark Paid', 'surecart')}
		>
			<Error error={error} setError={setError} />

			{__(
				'Are you sure you wish to mark the invoice as paid? This cannot be undone.',
				'surecart'
			)}

			{loading ||
				(busy && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						spinner
					/>
				))}
		</ConfirmDialog>
	);
};
