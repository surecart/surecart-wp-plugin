/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScFlex,
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
import { useEffect } from 'react';
import DatePicker from '../../../../components/DatePicker';
import Error from '../../../../components/Error';

export default ({ subscription, open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [pauseUntil, setPauseUntil] = useState();

	useEffect(() => {
		setPauseUntil(new Date(subscription?.restore_at * 1000));
	}, [subscription.restore_at]);

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
					subscription: {
						restore_at: Date.parse(pauseUntil) / 1000,
					},
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription paused.', 'surecart'), {
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
				label={__('Update', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} setError={setError} />
				<ScFlex
					flexDirection="column"
					style={{ '--spacing': '0.25em' }}
				>
					<div>
						{__(
							'Which date would you like to restore subscription?',
							'surecart'
						)}
					</div>
					<DatePicker
						placeholder={__('Choose date', 'surecart')}
						title={__('Restore subscription at?', 'surecart')}
						currentDate={pauseUntil}
						onChoose={(date) => setPauseUntil(date)}
					/>
				</ScFlex>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{__("Don't pause", 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					submit
					disabled={loading}
					slot="footer"
				>
					{__('Pause Subscription', 'surecart')}
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
