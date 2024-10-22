/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScDialog,
	ScForm,
	ScIcon,
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

	const onRegenerateKey = () => {
		setLicenseKey(
			'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(
				/[xy]/g,
				function (c) {
					const r = (Math.random() * 16) | 0;
					const v = c === 'x' ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				}
			)
		);
	};

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
			console.error(e);
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
			<ScAlert
				type="warning"
				open
				css={css`
					margin-bottom: var(--sc-form-row-spacing);
				`}
			>
				{__(
					'Changing the license key will invalidate the current license key.',
					'surecart'
				)}
			</ScAlert>
			<ScForm onScSubmit={onSubmit}>
				<ScInput
					label={__('License Key', 'surecart')}
					onScInput={(e) => setLicenseKey(e.target.value)}
					value={licenseKey}
					required
					autofocus={true}
					hasFocus={true}
				>
					<ScButton
						slot="suffix"
						type="text"
						onClick={onRegenerateKey}
						circle
						aria-label={__('Regenerate License Key', 'surecart')}
					>
						<ScIcon name="refresh-ccw" />
					</ScButton>
				</ScInput>
				<div
					css={css`
						display: flex;
						gap: var(--sc-spacing-small);
						margin-top: var(--sc-spacing-large);
					`}
				>
					<ScButton type="primary" submit loading={busy}>
						{__('Save and Update Key', 'surecart')}
					</ScButton>
					<ScButton onClick={() => onRequestClose()} type="text">
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</ScDialog>
	);
};
