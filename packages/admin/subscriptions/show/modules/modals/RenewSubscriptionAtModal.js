import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { DateTimePicker } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../../components/Error';
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from 'react';

export default ({ open, onRequestClose, subscription }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const [renewAt, setRenewAt] = useState(new Date());

	useEffect(() => {
		if (subscription?.current_period_end_at) {
			setRenewAt(new Date(subscription.current_period_end_at * 1000));
		}
	}, [subscription?.current_period_end_at]);

	const onChangeDate = (date) => {
		setRenewAt(date);
	};

	const cancel = () => {
		setRenewAt(new Date());
		onRequestClose();
	};

	const onUpdateRenewAt = async () => {
		if (!renewAt) return;
		try {
			setLoading(true);
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/periods/${subscription?.current_period?.id}`
				),
				data: {
					end_at: renewAt,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			setError(e);
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const isInvalidDate = (date) => {
		if (!!subscription?.cancel_at_period_end) {
			let isInvalid =
				Date.parse(
					new Date(subscription?.current_period_end_at * 1000)
				) > Date.parse(date);
			if (!!subscription?.restore_at) {
				isInvalid |=
					Date.parse(new Date(subscription?.restore_at * 1000)) <
					Date.parse(date);
			}

			return isInvalid;
		}
		return Date.parse(new Date()) > Date.parse(date);
	};

	return (
		<ScDialog
			label={__('Renew Subscription At', 'surecart')}
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
				currentDate={renewAt}
				onChange={onChangeDate}
				isInvalidDate={isInvalidDate}
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
				onClick={() => onUpdateRenewAt()}
				disabled={loading}
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
