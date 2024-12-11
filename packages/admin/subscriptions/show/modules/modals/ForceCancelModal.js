/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import Error from '../../../../components/Error';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
} from '@surecart/components-react';

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		try {
			setLoading(true);
			setError(null);

			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior: 'immediate',
				}),
				data: {
					restore_at: null,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription canceled.', 'surecart'), {
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
		<ScForm
			onScFormSubmit={onSubmit}
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
			`}
		>
			<ScDialog
				label={__('Confirm', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} setError={setError} />
				<div>
					{__(
						'Are you sure you want to cancel this subscription?',
						'surecart'
					)}
				</div>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{__("Don't cancel", 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					submit
					disabled={loading}
					slot="footer"
				>
					{__('Cancel Subscription', 'surecart')}
				</ScButton>
				{loading && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						zIndex="9"
						spinner
					/>
				)}
			</ScDialog>
		</ScForm>
	);
};
