/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDialog,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import Error from '../../../components/Error';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default ({ open, onRequestClose, license }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [licenseKey, setLicenseKey] = useState(() => license?.key);

	const onSubmit = async () => {
		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'license'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${license?.id}`,
				data: {
					key: licenseKey,
				},
			});

			receiveEntityRecords(
				'surecart',
				'license',
				{
					...license,
					key: data.key,
				},
				undefined,
				false,
				{
					key: license.key,
				}
			);

			createSuccessNotice(__('License Key updated.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
			console.log(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog
			label={__('Edit License Key', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScForm onScSubmit={onSubmit}>
				<ScInput
					label={__('License Key', 'surecart')}
					onScInput={(e) => setLicenseKey(e.target.value)}
					value={license?.key}
					required
					autofocus={true}
					hasFocus={true}
				/>
				<div
					css={css`
						display: flex;
						gap: var(--sc-spacing-small);
						margin-top: var(--sc-spacing-large);
					`}
				>
					<ScButton type="primary" submit loading={busy}>
						{__('Save', 'surecart')}
					</ScButton>
					<ScButton onClick={() => onRequestClose()} type="text">
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</ScDialog>
	);
};
