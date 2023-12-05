/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import Error from '../../../components/Error';

export default ({ open, returnRequest, onRequestClose, hasLoading }) => {
	const [loading, setLoading] = useState(hasLoading);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);

	const cancelReturnRequest = async () => {
		try {
			setLoading(true);
			setError(null);
			await deleteEntityRecord(
				'surecart',
				'return_request',
				returnRequest.id,
				null,
				{ throwOnError: true }
			);

			invalidateResolutionForStore();
			createSuccessNotice(__('Return Canceled.', 'surecart'), {
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
			label={__('Confirm', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			{__('Are you sure you wish to cancel the return?', 'surecart')}
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
					onClick={cancelReturnRequest}
					disabled={loading}
				>
					{__('Cancel Return', 'surecart')}
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
