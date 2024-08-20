/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import Error from '../../components/Error';

export default ({
	onRequestClose,
	open,
	invoice,
	changeInvoiceStatus,
	onUpdateInvoiceEntityRecord,
}) => {
	if (!invoice?.id) {
		return null;
	}

	const [error, setError] = useState(null);
	const [changingStatus, setChangingStatus] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onConfirm = async () => {
		try {
			setChangingStatus(true);
			const invoiceData = await changeInvoiceStatus('draft');
			onUpdateInvoiceEntityRecord(invoiceData);

			createSuccessNotice(
				__('Invoice marked as draft, you can now edit it.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			onRequestClose();
		} catch (e) {
			setChangingStatus(false);
			setError(e);
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
			{changingStatus && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
