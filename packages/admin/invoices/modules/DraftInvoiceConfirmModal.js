/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { checkoutExpands } from '../Invoice';

export default ({
	onRequestClose,
	open,
	invoice,
	busy,
	setBusy,
	onUpdateInvoiceEntityRecord,
}) => {
	if (!invoice?.id) {
		return null;
	}

	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onConfirm = async () => {
		try {
			setBusy(true);
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

			onUpdateInvoiceEntityRecord(invoiceData);

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
			onConfirm={onConfirm}
			onCancel={onRequestClose}
		>
			<Error error={error} />
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
