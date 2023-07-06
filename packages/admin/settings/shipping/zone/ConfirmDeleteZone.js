/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Error from '../../../components/Error';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticeStore } from '@wordpress/notices';

export default ({ onRequestClose, open, shippingZoneId }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);

	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticeStore);

	const onDeleteShippingZone = async () => {
		setBusy(true);
		try {
			await deleteEntityRecord(
				'surecart',
				'shipping-zone',
				shippingZoneId,
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Shipping zone deleted', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog label={__('Are you sure?', 'surecart')} open={open}>
			<Error error={error} setError={setError} />
			{__('This action cannot be undone.', 'surecart')}
			<ScButton
				type="text"
				slot="footer"
				onClick={() => onRequestClose()}
			>
				{__('Cancel', 'surecart')}
			</ScButton>
			<ScButton
				type="primary"
				slot="footer"
				onClick={onDeleteShippingZone}
			>
				{__('Delete', 'surecart')}
			</ScButton>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
