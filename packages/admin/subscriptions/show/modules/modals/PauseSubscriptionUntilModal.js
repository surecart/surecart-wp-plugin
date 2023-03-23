import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
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

export default ({ open, onRequestClose, currentPeriodEndAt }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [pauseParams, setPauseParams] = useState({
		pauseUntil: new Date(),
		pauseBehavior: 'pending',
	});
	const [section, setSection] = useState(CHOOSE_PAUSE_BEHAVIOR_SECTION);

	const cancel = () => {
		setPauseParams({
			pauseUntil: new Date(),
			pauseBehavior: 'pending',
		});
		onRequestClose();
		setSection(CHOOSE_PAUSE_BEHAVIOR_SECTION);
	};

	const onUpdatePauseUntil = async () => {
		if (section !== CHOOSE_DATE_SECTION) {
			setSection(CHOOSE_DATE_SECTION);
			return;
		}

		if (!pauseParams.pauseUntil) return;
		try {
			setLoading(true);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior: pauseParams.pauseBehavior,
				}),
				data: {
					restore_at: Date.parse(pauseParams.pauseUntil) / 1000,
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

	const onCancelButtonClick = () => {
		if (section !== CHOOSE_PAUSE_BEHAVIOR_SECTION) {
			setSection(CHOOSE_PAUSE_BEHAVIOR_SECTION);
			return;
		}
		cancel();
	};

	return (
		<ScDialog
			label={__('Pause Subscription Until', 'surecart')}
			open={open}
			onScRequestClose={cancel}
			style={{
				'--width': '23rem',
				'--body-spacing':
					section === CHOOSE_DATE_SECTION
						? 'var(--sc-spacing-xx-large) var(--sc-spacing-xx-large) 0 var(--sc-spacing-xx-large)'
						: 'var(--sc-spacing-medium)',
				'--footer-spacing':
					section === CHOOSE_DATE_SECTION
						? 'var(--sc-spacing-xx-large)'
						: 'var(--sc-spacing-medium)',
			}}
		>
			<Error error={error} setError={setError} />
			{section === CHOOSE_PAUSE_BEHAVIOR_SECTION ? (
				<ScChoices
					label={__(
						'When do you want to pause the subscription?',
						'surecart'
					)}
				>
					<div>
						<ScChoice
							name="pause_behavior"
							value="immediate"
							checked={pauseParams.pauseBehavior === 'immediate'}
							onClick={() =>
								setPauseParams({
									...pauseParams,
									pauseBehavior: 'immediate',
								})
							}
						>
							{__('Immediately', 'surecart')}
							<div slot="description">
								This will revoke access immediately
							</div>
						</ScChoice>
						{currentPeriodEndAt !== null && (
							<ScChoice
								name="pause_behavior"
								checked={
									pauseParams.pauseBehavior === 'pending'
								}
								value="pending"
								onClick={() =>
									setPauseParams({
										...pauseParams,
										pauseBehavior: 'pending',
									})
								}
							>
								{__('	At end of current period', 'surecart')}
							</ScChoice>
						)}
					</div>
				</ScChoices>
			) : (
				<DateTimePicker
					currentDate={pauseParams.pauseUntil}
					onChange={(pauseUntil) =>
						setPauseParams({ ...pauseParams, pauseUntil })
					}
					isInvalidDate={(date) => {
						return Date.parse(new Date()) > Date.parse(date);
					}}
				/>
			)}

			<ScButton
				type="text"
				slot="footer"
				onClick={onCancelButtonClick}
				disabled={loading}
			>
				{__(
					section === CHOOSE_PAUSE_BEHAVIOR_SECTION
						? 'Cancel'
						: 'Back',
					'surecart'
				)}
			</ScButton>

			<ScButton
				type="primary"
				slot="footer"
				onClick={() => onUpdatePauseUntil()}
				disabled={
					section === CHOOSE_DATE_SECTION &&
					(loading || pauseParams.pauseUntil <= new Date())
				}
			>
				{__(
					section === CHOOSE_PAUSE_BEHAVIOR_SECTION
						? 'Next'
						: 'Pause',
					'surecart'
				)}
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
