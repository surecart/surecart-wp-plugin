/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScButton,
	ScFormatDate,
	ScTag,
	ScCard,
	ScEmpty,
	ScDialog,
	ScBlockUi,
} from '@surecart/components-react';
import SettingsBox from '../SettingsBox';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import DataTable from '../../components/DataTable';

export default () => {
	const [details, setDetails] = useState(null);
	const [retrying, setRetrying] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const retry = async (id) => {
		try {
			setRetrying(true);
			const response = await apiFetch({
				method: 'POST',
				path: `/surecart/v1/incoming_webhooks/${id}/retry/`,
			});
			receiveEntityRecords('surecart', 'incoming_webhook', response);
			createSuccessNotice(__('Retry successful!', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
			(e?.additional_errors || []).forEach((error) =>
				createErrorNotice(e?.message, { type: 'snackbar' })
			);
		} finally {
			setRetrying(false);
		}
	};

	const { webhooks, loadingWebhooks } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'incoming_webhook',
			{
				processed: false,
				per_page: 30,
				page: 1,
			},
		];
		return {
			webhooks: select(coreStore).getEntityRecords(...queryArgs),
			loadingWebhooks: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});

	return (
		<SettingsBox
			title={__('Webhook Processing Health', 'surecart')}
			description={__(
				'If you have any webhooks that failed to process on your site, you can retry them here.',
				'surecart'
			)}
			loading={loadingWebhooks}
			noButton
			wrapperTag="div"
		>
			{!!webhooks?.length ? (
				<ScCard noPadding>
					<DataTable
						columns={{
							event: {
								label: __('Event', 'surecart'),
							},
							date: {
								label: __('Date', 'surecart'),
							},
							status: {
								label: __('Status', 'surecart'),
								width: '150px',
							},
							actions: {
								width: '150px',
							},
						}}
						empty={__('None found.', 'surecart')}
						items={(webhooks || []).map(
							({
								id,
								webhook_id,
								data,
								created_at,
								processed,
							}) => {
								return {
									event: (
										<div>
											<div>
												<strong>{data?.type}</strong>
											</div>
											<div
												css={css`
													opacity: 0.5;
												`}
											>
												{webhook_id}
											</div>
										</div>
									),
									key: id,
									date: (
										<ScFormatDate
											value={created_at}
											month="short"
											day="numeric"
											hour="numeric"
											minute="numeric"
										/>
									),
									status: processed ? (
										<ScTag type="success" size="small">
											{__('Processed', 'surecart')}
										</ScTag>
									) : (
										<ScTag type="danger" size="small">
											{__('Not Processed', 'surecart')}
										</ScTag>
									),
									actions: (
										<div
											css={css`
												display: flex;
												flex-wrap: wrap;
												justify-content: flex-end;
												gap: 0.5em;
											`}
										>
											<ScButton
												size="small"
												onClick={() => setDetails(data)}
											>
												{__('View Details', 'surecart')}
											</ScButton>
											{/* {!processed && ( */}
											<ScButton
												size="small"
												onClick={() => retry(id)}
											>
												{__('Retry', 'surecart')}
											</ScButton>
											{/* )} */}
										</div>
									),
								};
							}
						)}
					/>
				</ScCard>
			) : (
				<ScCard>
					<ScEmpty icon="check">
						{__('Webhooks are functioning normally.', 'surecart')}
					</ScEmpty>
				</ScCard>
			)}

			<ScDialog
				label={__('Webhook Details', 'surecart')}
				open={details}
				onScRequestClose={() => setDetails(false)}
				style={{ '--width': '600px' }}
			>
				<pre
					css={css`
						padding: var(--sc-spacing-medium);
						background: var(--sc-color-gray-900);
						overflow: auto;
						color: white;
						border-radius: var(--sc-border-radius-medium);
					`}
				>
					{JSON.stringify(details, null, 2)}
				</pre>
			</ScDialog>

			{retrying && <ScBlockUi spinner />}
		</SettingsBox>
	);
};
