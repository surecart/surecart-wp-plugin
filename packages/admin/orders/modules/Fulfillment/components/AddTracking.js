import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
} from '@surecart/components-react';
import { __, _n } from '@wordpress/i18n';
import Tracking from './Tracking';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from 'react';

export default ({ fulfillment, open, onRequestClose }) => {
	const [trackings, setTrackings] = useState([{ number: '', url: '' }]);
	const [busy, setBusy] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);

	useEffect(() => {
		setTrackings(
			fulfillment?.trackings?.data?.length
				? fulfillment?.trackings?.data
				: [{ number: '', url: '' }]
		);
	}, [fulfillment?.trackings?.data]);

	const addTracking = async () => {
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'fulfillment',
				{
					id: fulfillment?.id,
					trackings: trackings.filter(
						({ number, url }) => !!number && !!url
					),
				},
				{
					throwOnError: true,
				}
			);
			onRequestClose();
		} catch (error) {
			console.log(error);
			createErrorNotice(
				error?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm
			onScSubmit={(e) => e.stopImmediatePropagation()}
			onScFormSubmit={(e) => {
				e.stopImmediatePropagation();
				addTracking();
			}}
		>
			<ScDialog
				label={
					fulfillment?.trackings?.data?.length > 0
						? __('Edit Tracking', 'surecart')
						: __('Add Tracking', 'surecart')
				}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Tracking trackings={trackings} setTrackings={setTrackings} />

				<ScButton type="primary" submit slot="footer" busy={busy}>
					{fulfillment?.trackings?.data?.length > 0
						? __('Update', 'surecart')
						: __('Add', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDialog>
		</ScForm>
	);
};
