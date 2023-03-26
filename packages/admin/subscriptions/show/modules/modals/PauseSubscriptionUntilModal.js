import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScIcon,
} from '@surecart/components-react';
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

const CHOOSE_PAUSE_BEHAVIOR_SECTION = 1;
const CHOOSE_DATE_SECTION = 2;

export default ({ open, onRequestClose, currentPeriodEndAt, subscription }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [cancelBehavior, setCancelBehavior] = useState('pending');
	const [pauseUntil, setPauseUntil] = useState(new Date());
	const [section, setSection] = useState(CHOOSE_PAUSE_BEHAVIOR_SECTION);

	const cancel = () => {
		setCancelBehavior('pending');
		setPauseUntil(new Date());
		onRequestClose();
		setSection(CHOOSE_PAUSE_BEHAVIOR_SECTION);
	};

	const onUpdatePauseUntil = async () => {
		if (!pauseUntil) return;

		try {
			setLoading(true);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior: cancelBehavior,
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
			(e?.additional_errors || []).forEach((e) => {
				createErrorNotice(
					e?.message || __('Something went wrong', 'surecart'),
					{ type: 'snackbar' }
				);
			});
		} finally {
			setLoading(false);
		}
	};

	if (section === CHOOSE_PAUSE_BEHAVIOR_SECTION) {
		return (
			<ScDialog
				label={__('Pause Subscription', 'surecart')}
				open={open}
				onScRequestClose={cancel}
				style={{
					'--width': '23rem',
					'--body-spacing': 'var(--sc-spacing-medium)',
					'--footer-spacing': 'var(--sc-spacing-medium)',
				}}
			>
				<Error error={error} setError={setError} />

				<ScChoices>
					{currentPeriodEndAt !== null && (
						<ScChoice
							name="pause_behavior"
							checked={cancelBehavior === 'pending'}
							value="pending"
							onClick={() => setCancelBehavior('pending')}
						>
							{__('At end of current period', 'surecart')}
							<div slot="description">
								{__(
									'Let customer finish their current period',
									'surecart'
								)}
							</div>
						</ScChoice>
					)}

					<ScChoice
						name="pause_behavior"
						value="immediate"
						checked={cancelBehavior === 'immediate'}
						onClick={() => setCancelBehavior('immediate')}
					>
						{__('Immediately', 'surecart')}
						<div slot="description">
							{__(
								'This will revoke access immediately',
								'surecart'
							)}
						</div>
					</ScChoice>
				</ScChoices>

				<ScButton
					type="primary"
					slot="footer"
					onClick={() => setSection(CHOOSE_DATE_SECTION)}
				>
					{__('Next', 'surecart')}
					<ScIcon name="arrow-right" slot="suffix" />
				</ScButton>
			</ScDialog>
		);
	}

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
				onChange={(pauseUntil) => setPauseUntil(pauseUntil)}
				isInvalidDate={(date) => {
					if (
						cancelBehavior === 'pending' &&
						subscription?.current_period_end_at
					) {
						return (
							Date.parse(
								new Date(
									subscription?.current_period_end_at * 1000
								)
							) > Date.parse(date)
						);
					}
					return Date.parse(new Date()) > Date.parse(date);
				}}
			/>

			<ScButton
				type="text"
				slot="footer"
				onClick={() => setSection(CHOOSE_PAUSE_BEHAVIOR_SECTION)}
				disabled={loading}
			>
				{__('Back', 'surecart')}
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
