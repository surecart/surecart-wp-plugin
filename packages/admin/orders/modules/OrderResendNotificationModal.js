import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../../components/Error';

export default ({ order, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const resendNotification = async () => {
		try {
			setLoading(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'order'
			);

			await apiFetch({
				method: 'POST',
				path: `${baseURL}/${order?.id}/resend_notification`,
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
			label={__('Resend Notification', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			{__(
				'Are you sure you wish to resend the order notification?',
				'surecart'
			)}
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Go Back', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={resendNotification}
					disabled={loading}
				>
					{__('Resend Notification', 'surecart')}
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
