import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { select, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../../components/Error';

export default ({ invoice, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const resendNotification = async () => {
		try {
			setError(null);
			setLoading(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'invoice'
			);

			await apiFetch({
				method: 'POST',
				path: `${baseURL}/${invoice?.id}/resend_notification`,
			});

			createSuccessNotice(__('Notification resent.', 'surecart'), {
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
			label={__('Resend Invoice', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			{__('Are you sure you wish to resend the invoice?', 'surecart')}
			<div slot="footer">
				<ScButton
					type="text"
					disabled={loading}
					onClick={onRequestClose}
				>
					{__('Go Back', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={resendNotification}
					disabled={loading}
				>
					{__('Resend Invoice', 'surecart')}
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
