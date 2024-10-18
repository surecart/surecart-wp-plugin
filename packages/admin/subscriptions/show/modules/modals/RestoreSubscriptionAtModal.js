/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScAlert,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { DateTimePicker } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../../components/Error';
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from 'react';

export default ({ open, onRequestClose, subscription }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [restoreAt, setRestoreAt] = useState(new Date());

	useEffect(() => {
		if (!!subscription?.restore_at) {
			setRestoreAt(new Date(subscription.restore_at * 1000));
		}
	}, [subscription?.restore_at]);

	const onChangeDate = (date) => {
		setRestoreAt(date);
	};

	const cancel = () => {
		setRestoreAt(new Date());
		onRequestClose();
	};

	const onUpdateRestoreAt = async () => {
		if (!restoreAt) return;
		try {
			setLoading(true);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}`, {
					cancel_behavior: 'immediate',
				}),
				data: {
					restore_at: Date.parse(restoreAt) / 1000,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setLoading(false);
		}
	};

	const isInvalidDate = (date) => {
		const today = new Date();
		const oneYearFromNow = new Date(
			today.getFullYear() + 1,
			today.getMonth(),
			today.getDate()
		);

		return (
			// the chosen date is less than the subscription end period.
			Date.parse(new Date(subscription?.current_period_end_at * 1000)) >
				Date.parse(date) ||
			// the chosen date is greater than one year from now.
			Date.parse(date) > Date.parse(oneYearFromNow)
		);
	};

	const isSetToPause = () => {
		return (
			// subscription is not set to cancel
			!!subscription?.cancel_at_period_end &&
			// subscription has an end date.
			!!subscription?.current_period_end_at &&
			// subscription is not canceled.
			subscription?.status !== 'canceled' &&
			// subscription is set to restore.
			!!subscription?.restore_at
		);
	};

	return (
		<ScDialog
			label={__('Restore Subscription At', 'surecart')}
			open={open}
			onScRequestClose={cancel}
			style={{
				'--width': '23rem',
				'--body-spacing':
					'var(--sc-spacing-xx-large) var(--sc-spacing-xx-large) 0 var(--sc-spacing-xx-large)',
				'--footer-spacing': 'var(--sc-spacing-xx-large)',
			}}
		>
			<Error error={error} setError={setError} />

			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-small);
				`}
			>
				{isSetToPause() && (
					<ScAlert type="info" open>
						{sprintf(
							__(
								'This subscription is going to be paused on %s. When would you like the subscription to be restored?',
								'surecart '
							),
							subscription?.current_period_end_at_date
						)}
					</ScAlert>
				)}
				<DateTimePicker
					currentDate={restoreAt}
					onChange={onChangeDate}
					isInvalidDate={isInvalidDate}
				/>
			</div>

			<ScButton
				type="text"
				slot="footer"
				onClick={onRequestClose}
				disabled={loading}
			>
				{__('Cancel', 'surecart')}
			</ScButton>

			<ScButton
				type="primary"
				slot="footer"
				onClick={() => onUpdateRestoreAt()}
				disabled={
					loading ||
					restoreAt <= new Date(subscription?.restore_at * 1000)
				}
			>
				{__('Update Subscription', 'surecart')}
			</ScButton>

			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
