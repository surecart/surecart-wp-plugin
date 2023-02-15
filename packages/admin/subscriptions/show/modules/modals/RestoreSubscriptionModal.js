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
import { formatNumber } from '../../../../util';

export default ({ open, onRequestClose, amountDue, currency }) => {
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
			label={__('Restore Subscription', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScFlex flexDirection="column">
				<ScAlert
					type="warning"
					title={__('Confirm Charge', 'surecart')}
					open
				>
					{!!amountDue && !!currency
						? sprintf(
								__(
									'The customer will immediately be charged %s for the first billing period.',
									'surecart'
								),
								formatNumber(amountDue, currency)
						  )
						: __(
								'The customer will immediately be charged the first billing period.',
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
						'This will make the subscription active again and charge the customer immediately.',
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
