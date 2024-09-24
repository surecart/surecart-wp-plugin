/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default ({ onRequestClose, open }) => {
	const { invoice, receiveInvoice, checkoutExpands } = useInvoice();
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(busy);
	const { createSuccessNotice } = useDispatch(noticesStore);
	if (!invoice?.id) {
		return null;
	}

	const draftInvoice = async () => {
		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			const invoiceData = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${invoice?.id}/make_draft`, {
					expand: checkoutExpands,
				}),
			});

			receiveInvoice(invoiceData);

			createSuccessNotice(
				__('Invoice marked as draft, you can now edit it.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

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
			onConfirm={draftInvoice}
			onCancel={onRequestClose}
		>
			<Error error={error} setError={setError} />

			{__(
				'Are you sure you want to change the status of this invoice to draft?',
				'surecart'
			)}
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
