/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScForm,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import Error from '../../../../components/Error';

export default ({ subscription, open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [checked, setChecked] = useState('immediate');
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		const { cancel_behavior } = await e.target.getFormJson();
		try {
			setLoading(true);
			setError(null);

			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior,
				}),
			});

			await invalidateResolutionForStore();

			createSuccessNotice(
				cancel_behavior === 'immediate'
					? __('Subscription canceled.', 'surecart')
					: __('Subscription scheduled for cancelation.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
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
				<ScChoices
					label={__(
						'When do you want to cancel the subscription?',
						'surecart'
					)}
				>
					<div>
						<ScChoice
							name="cancel_behavior"
							value="immediate"
							checked={checked === 'immediate'}
							onClick={() => setChecked('immediate')}
						>
							{__('Immediately', 'surecart')}
						</ScChoice>
						{subscription?.current_period_end_at !== null && (
							<ScChoice
								name="cancel_behavior"
								checked={checked === 'pending'}
								value="pending"
								onClick={() => setChecked('pending')}
							>
								{__('	At end of current period', 'surecart')}
							</ScChoice>
						)}
					</div>
				</ScChoices>
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
