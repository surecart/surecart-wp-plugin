/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScAlert, ScButton, ScIcon } from '@surecart/components-react';
import { store as noticesStore } from '@wordpress/notices';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

export default ({ webhook }) => {
	const [saving, setSaving] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const resync = async () => {
		try {
			setSaving(true);
			await apiFetch({
				method: 'POST',
				path: '/surecart/v1/webhook_endpoint/resync',
			});
			createSuccessNotice(__('Webhook resynced.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);

			createErrorNotice(
				`${__('Error:', 'surecart')} ${
					e?.message || __('Something went wrong', 'surecart')
				}`,
				{
					type: 'snackbar',
				}
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div
			css={css`
				display: grid;
				gap: 1em;
			`}
		>
			{!!webhook?.erroring_grace_period_ends_at && (
				<ScAlert type="warning" open>
					<span slot="title">
						{__(
							'This webhook endpoint is being monitored due to repeated errors.',
							'surecart'
						)}
					</span>
					{sprintf(
						__(
							'If this endpoint is important to your integration, please try and fix the issue. We will disable this endpoint on %s if it continues to fail.',
							'surecart'
						),
						webhook?.erroring_grace_period_ends_at_date_time
					)}
					<br />
					<ScButton
						href={`${scData.app_url}/webhook_endpoints?switch_account_id=${scData?.account_id}`}
						target="_blank"
					>
						{__('View Logs', 'surecart')}
						<ScIcon slot="suffix" name="external-link" />
					</ScButton>
				</ScAlert>
			)}
			<div>
				<ScButton onClick={resync} busy={saving}>
					<ScIcon slot="prefix" name="refresh-ccw" />
					{__('Resync Webhooks', 'surecart')}
				</ScButton>
			</div>
		</div>
	);
};
