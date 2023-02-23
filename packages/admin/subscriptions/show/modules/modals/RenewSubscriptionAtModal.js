import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScText,
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
import { useEffect } from 'react';

export default ({ open, onRequestClose, subscription }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
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
			label={__('Renew Subscription At', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScFlex flexDirection="column">
				<ScText
					style={{
						'--font-size': 'var(--sc-font-size-medium)',
						'--color': 'var(--sc-input-label-color)',
						'--line-height': 'var(--sc-line-height-dense)',
					}}
				>
					{__('When should the subscription be renewed?', 'surecart')}
				</ScText>
				<DateTimePicker
					currentDate={renewAt}
					onChange={onChangeDate}
					isInvalidDate={(date) => {
						return Date.parse(new Date()) > Date.parse(date);
					}}
				/>
			</ScFlex>
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__("Don't update subscription", 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={() => onUpdateRenewAt()}
					disabled={loading}
				>
					{__('Update subscription', 'surecart')}
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
