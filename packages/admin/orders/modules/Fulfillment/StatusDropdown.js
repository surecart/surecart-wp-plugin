/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScCheckbox,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScTag,
	ScSpinner,
	ScBlockUi,
} from '@surecart/components-react';
import { useDispatch, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __, _n } from '@wordpress/i18n';
import { useEffect, useState } from 'react';

const status = {
	pending: __('Not Shipped', 'surecart'),
	shipped: __('Shipped', 'surecart'),
	delivered: __('Delivered', 'surecart'),
};

const types = {
	pending: 'warning',
	shipped: 'default',
	delivered: 'success',
};

export default ({ fulfillment, ...rest }) => {
	const [busy, setBusy] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(
		fulfillment?.notifications_enabled
	);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	useEffect(() => {
		setNotificationsEnabled(fulfillment?.notifications_enabled);
	}, [fulfillment]);

	const saveStatus = async (shipping_status) => {
		// status didn't change.
		if (shipping_status === fulfillment?.shipping_status) return;

		try {
			setBusy(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'fulfillment'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${fulfillment.id}`,
				data: {
					shipping_status,
					notifications_enabled: notificationsEnabled,
				},
			});

			await receiveEntityRecords('surecart', 'fulfillment', data);

			createSuccessNotice(__('Status updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);

			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<ScDropdown {...rest}>
				<ScTag
					slot="trigger"
					type={types?.[fulfillment?.shipping_status] || 'default'}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.25em;
						`}
					>
						{status?.[fulfillment?.shipping_status] ||
							fulfillment?.shipping_status}
						<ScIcon name="chevron-down" />
					</div>
				</ScTag>

				<ScMenu>
					{Object.keys(status).map((key) => (
						<ScMenuItem
							onClick={() => saveStatus(key)}
							checked={key === fulfillment?.shipping_status}
						>
							{status[key]}
						</ScMenuItem>
					))}
					<ScMenuDivider />
					<ScCheckbox
						css={css`
							padding: 0.5em 1em;
						`}
						onScChange={(e) =>
							setNotificationsEnabled(e.target.checked)
						}
					>
						{__('Notify customer of status change', 'surecart')}
					</ScCheckbox>
				</ScMenu>
			</ScDropdown>
			{busy && <ScBlockUi spinner />}
		</>
	);
};
