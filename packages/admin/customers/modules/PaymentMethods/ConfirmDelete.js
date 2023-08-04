/** @jsx jsx */
import { Modal } from '@wordpress/components';
import { css, jsx } from '@emotion/core';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import Error from '../../../components/Error';
import { ScButton } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { useState } from 'react';

export default ({ onRequestClose, paymentMethod }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const onDelete = async () => {
		try {
			setBusy(true);
			setError(null);
			await apiFetch({
				path: `surecart/v1/payment_methods/${paymentMethod?.id}/detach`,
				method: 'PATCH',
			});
			createSuccessNotice(__('Payment method deleted.', 'surecart'), {
				type: 'snackbar',
			});
			await invalidateResolutionForStore();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Modal
			title={__('Delete this payment method?', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<Error error={error} setError={setError} />
			<p>
				{__(
					'Are you sure you want to delete this payment method?',
					'surecart'
				)}
			</p>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
				`}
			>
				<ScButton
					type="primary"
					busy={busy}
					disabled={busy}
					onClick={onDelete}
				>
					{__('Delete', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
			</div>
		</Modal>
	);
};
