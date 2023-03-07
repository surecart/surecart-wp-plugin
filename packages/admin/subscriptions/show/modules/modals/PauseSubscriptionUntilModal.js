import { ScBlockUi, ScButton } from '@surecart/components-react';
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
import { ScDialog } from '@surecart/components-react';

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [pauseUntil, setPauseUntil] = useState(new Date());

	const onChangeDate = (date) => {
		setPauseUntil(date);
	};

	const cancel = () => {
		setPauseUntil(new Date());
		onRequestClose();
	};

	const onUpdatePauseUntil = async () => {
		if (!pauseUntil) return;
		try {
			setLoading(true);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior: 'immediate',
				}),
				data: {
					restore_at: Date.parse(pauseUntil) / 1000,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription paused.', 'surecart'), {
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
			label={__('Pause Subscription Until', 'surecart')}
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
				currentDate={pauseUntil}
				onChange={onChangeDate}
				isInvalidDate={(date) => {
					return Date.parse(new Date()) > Date.parse(date);
				}}
			/>

			<ScButton
				type="text"
				slot="footer"
				onClick={cancel}
				disabled={loading}
			>
				{__('Cancel', 'surecart')}
			</ScButton>

			<ScButton
				type="primary"
				slot="footer"
				onClick={() => onUpdatePauseUntil()}
				disabled={loading || pauseUntil <= new Date()}
			>
				{__('Pause', 'surecart')}
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
