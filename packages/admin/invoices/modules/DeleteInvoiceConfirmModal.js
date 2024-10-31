/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default ({ open, onRequestClose }) => {
	const { invoice, loading: hasLoading } = useInvoice();
	const [loading, setLoading] = useState(hasLoading);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord } = useDispatch(coreStore);

	const onDelete = async () => {
		try {
			setLoading(true);
			setError(null);

			const invoiceId = invoice.id;
			await deleteEntityRecord(
				'surecart',
				'invoice',
				invoiceId,
				undefined,
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(__('Invoice deleted.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();

			window.location.assign('admin.php?page=sc-invoices');
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={onDelete}
			onCancel={onRequestClose}
			confirmButtonText={__('Delete', 'surecart')}
		>
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-medium);
				`}
			/>

			{__('Are you sure you want to delete this invoice?', 'surecart')}

			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
