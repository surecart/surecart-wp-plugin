import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { DateTimePicker } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../../components/Error';
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from 'react';

export default ({ open, onRequestClose, currentRestoreAt }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [restoreAt, setRestoreAt] = useState(new Date());

	useEffect(() => {
		if (currentRestoreAt) {
			setRestoreAt(new Date(currentRestoreAt * 1000));
		}
	}, [currentRestoreAt]);

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

			<DateTimePicker
				currentDate={restoreAt}
				onChange={onChangeDate}
				isInvalidDate={(date) => {
					return Date.parse(new Date()) > Date.parse(date);
				}}
			/>

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
					loading || restoreAt <= new Date(currentRestoreAt * 1000)
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
