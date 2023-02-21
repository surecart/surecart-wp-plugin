import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../../components/Error';
import { addQueryArgs } from '@wordpress/url';

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const onPayOff = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/pay_off`, {
					update_behavior: 'immediate',
					pay_off: 1,
				}),
				data: {},
			});

			await invalidateResolutionForStore();
			createSuccessNotice(__('Subscription paid off.', 'surecart'), {
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

			<ScAlert
				type="warning"
				title={__('Confirm Charge', 'surecart')}
				open
			>
				{__(
					'Are you sure you want to pay off subscription? This will immediately charge the customer the remaining payments on their plan.',
					'surecart'
				)}
			</ScAlert>
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Cancel', 'surecart')}
				</ScButton>{' '}
				<ScButton type="primary" onClick={onPayOff} disabled={loading}>
					{__('Pay off', 'surecart')}
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
