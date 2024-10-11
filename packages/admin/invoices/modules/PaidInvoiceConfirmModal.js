/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import Error from '../../components/Error';

export default ({ open, onRequestClose }) => {
	const { loading, markAsPaidRequest } = useInvoice();
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const markAsPaid = async () => {
		try {
			setBusy(true);

			await markAsPaidRequest();

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
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-medium);
				`}
			/>

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
