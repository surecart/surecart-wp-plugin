import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScText,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../../components/Error';

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const restoreSubscription = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				method: 'PATCH',
				path: `surecart/v1/subscriptions/${id}/restore/`,
			});
			// invalidate page.
			await invalidateResolutionForStore();
			createSuccessNotice(__('Subscription restored.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
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
			<ScFlex flexDirection="column">
				<ScAlert type="warning" title={__('Warning', 'surecart')} open>
					{__(
						'This will charge the customer for their current billing period.',
						'surecart'
					)}
				</ScAlert>
				<ScText
					style={{
						'--font-size': 'var(--sc-font-size-medium)',
						'--color': 'var(--sc-input-label-color)',
						'--line-height': 'var(--sc-line-height-dense)',
					}}
				>
					{__(
						'Are you sure you want to restore this subscription? This will make it active again and charge the customer immediately.',
						'surecart'
					)}
				</ScText>
			</ScFlex>

			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Cancel', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={() => restoreSubscription()}
					disabled={loading}
				>
					{__('Restore', 'surecart')}
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
