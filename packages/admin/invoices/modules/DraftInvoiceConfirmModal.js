/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default ({ onRequestClose, open }) => {
	const { invoice, makeDraftRequest } = useInvoice();
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

			await makeDraftRequest();

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
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-medium);
				`}
			/>

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
