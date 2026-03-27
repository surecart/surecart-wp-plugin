/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	ScButton,
	ScTag,
	ScCard,
	ScEmpty,
	ScDialog,
	ScBlockUi,
	ScButtonGroup,
	ScIcon,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import SettingsBox from '../SettingsBox';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import DataTable from '../../components/DataTable';

const filters = {
	failed: __('Failed', 'surecart'),
	succeeded: __('Succeeded', 'surecart'),
	all: __('All', 'surecart'),
};

export default () => {
	const [details, setDetails] = useState(null);
	const [retrying, setRetrying] = useState(false);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [filter, setFilter] = useState('failed');
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

	const { webhooks, loadingWebhooks } = useSelect(
		(select) => {
			const processed =
				filter === 'all'
					? undefined
					: filter === 'failed'
					? false
					: true;
			const queryArgs = [
				'surecart',
				'incoming_webhook',
				{
					processed,
					per_page: perPage,
					page,
				},
			];
			return {
				webhooks: select(coreStore).getEntityRecords(...queryArgs),
				loadingWebhooks: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[page, filter]
	);

	useEffect(() => {
		setPage(1);
	}, [filter]);

	return (
		<SettingsBox
			title={__('SureCart Event Processing Health', 'surecart')}
			description={__(
				'If you have any webhooks that failed to process on your site, you can retry them here.',
				'surecart'
			)}
			loading={loadingWebhooks}
			noButton
			wrapperTag="div"
		>
			<>
				<ScDropdown>
					<ScButton slot="trigger" type="text" caret>
						{filters[filter]}
					</ScButton>
					<ScMenu>
						<ScMenuItem
							onClick={() => setFilter('all')}
							checked={'all' === filter}
						>
							{filters['all']}
						</ScMenuItem>
						<ScMenuItem
							onClick={() => setFilter('failed')}
							checked={'failed' === filter}
						>
							{filters['failed']}
						</ScMenuItem>
						<ScMenuItem
							onClick={() => setFilter('succeeded')}
							checked={'succeeded' === filter}
						>
							{filters['succeeded']}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>

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
									created_at_date_time,
									processed,
								}) => {
									return {
										event: (
											<div>
												<div>
													<strong>
														{data?.type}
													</strong>
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
										date: created_at_date_time,
										status: processed ? (
											<ScTag type="success" size="small">
												{__('Processed', 'surecart')}
											</ScTag>
										) : (
											<ScTag type="danger" size="small">
												{__(
													'Not Processed',
													'surecart'
												)}
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
													onClick={() =>
														setDetails(data)
													}
												>
													{__(
														'View Details',
														'surecart'
													)}
												</ScButton>
												{!processed && (
													<ScButton
														size="small"
														onClick={() =>
															retry(id)
														}
													>
														{__(
															'Retry',
															'surecart'
														)}
													</ScButton>
												)}
											</div>
										),
									};
								}
							)}
						/>
					</ScCard>
				) : (
					<ScCard>
						<ScEmpty icon={page === 1 ? 'check' : 'archive'}>
							{page === 1
								? __(
										'Webhooks are functioning normally.',
										'surecart'
								  )
								: __(
										'There are no more webhooks to show.',
										'surecart'
								  )}
						</ScEmpty>
					</ScCard>
				)}

				{(webhooks?.length >= perPage || page > 1) && (
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: center;
							margin-top: var(--sc-spacing-large);
						`}
					>
						<ScButtonGroup>
							<ScButton
								disabled={page === 1}
								onClick={(e) => {
									e.preventDefault();
									setPage(page - 1);
								}}
							>
								<ScIcon name="chevron-left" />
							</ScButton>
							<ScButton
								disabled={webhooks?.length < perPage}
								onClick={(e) => {
									e.preventDefault();
									setPage(page + 1);
								}}
							>
								<ScIcon name="chevron-right" />
							</ScButton>
						</ScButtonGroup>
					</div>
				)}
			</>

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
