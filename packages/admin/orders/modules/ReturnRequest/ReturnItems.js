/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScFormatNumber,
	ScBlockUi,
	ScFormatDate,
	ScTag,
} from '@surecart/components-react';
import LineItemView from '../Fulfillment/components/LineItem';
import Box from '../../../ui/Box';
import ReturnCancelConfirmModal from './ReturnCancelConfirmModal';
import { createErrorString } from '../../../util';

export default ({ returnRequest, onChangeRequestStatus, loading }) => {
	if (!returnRequest?.id) {
		return null;
	}

	const [modal, setModal] = useState(false);
	const [busy, setBusy] = useState(false);
	const { invalidateResolutionForStore } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	let total = (returnRequest?.return_items?.data || []).reduce(
		(accumulator, item) => {
			return accumulator + item?.line_item?.quantity;
		},
		0
	);

	const changeReturnStatus = async (status) => {
		if (!['open', 'completed'].includes(status)) {
			return;
		}

		try {
			setBusy(true);

			const path = status === 'open' ? 'open' : 'complete';

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'return_request'
			);

			await apiFetch({
				path: `${baseURL}/${returnRequest.id}/${path}`,
				method: 'PATCH',
			});

			invalidateResolutionForStore();
			onChangeRequestStatus();
			createSuccessNotice(
				status === 'open'
					? __('Return re-opened.', 'surecart')
					: __('Return completed.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), {
				type: 'snackbar',
			});
		} finally {
			setBusy(false);
		}
	};

	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.75em;
					`}
				>
					<ScIcon
						css={css`
							font-size: 22px;
							color: ${returnRequest?.status === 'completed'
								? 'var(--sc-color-success-500)'
								: 'var(--sc-color-warning-500)'};
						`}
						name="refresh-cw"
					/>
					{returnRequest?.status === 'completed'
						? __('Return completed', 'surecart')
						: __('Return in progress', 'surecart')}{' '}
					<ScTag
						css={css`
							font-size: 12px;
						`}
						pill
						type={
							returnRequest?.status === 'completed'
								? 'success'
								: 'warning'
						}
					>
						{sprintf(
							_n('%d Item', '%d Items', total, 'surecart'),
							total
						)}
					</ScTag>
					<div
						css={css`
							opacity: 0.65;
							font-weight: normal;
							font-size: 14px;
						`}
					>
						#{returnRequest?.number}
					</div>
				</div>
			}
			header_action={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
						min-width: auto !important;
					`}
				>
					<ScDropdown placement="bottom-end">
						<ScButton
							circle
							type="text"
							style={{
								'--button-color': 'var(--sc-color-gray-600)',
								margin: '-10px',
							}}
							slot="trigger"
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							{returnRequest?.status === 'open' && (
								<ScMenuItem
									onClick={() =>
										changeReturnStatus('completed')
									}
								>
									{__('Complete Return', 'surecart')}
								</ScMenuItem>
							)}

							{returnRequest?.status === 'completed' && (
								<ScMenuItem
									onClick={() => changeReturnStatus('open')}
								>
									{__('Open Return', 'surecart')}
								</ScMenuItem>
							)}

							<ScMenuItem
								onClick={() => setModal('return_cancel')}
								css={css`
									--sc-menu-item-color: var(
										--sc-color-danger-600
									);
								`}
							>
								{__('Cancel return', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</div>
			}
			loading={loading}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-xx-large);
				`}
			>
				<div
					css={css`
						display: flex;
						gap: 0.75em;
						color: var(
							--sc-line-item-title-color,
							var(--sc-input-label-color)
						);
					`}
				>
					<ScIcon
						name="calendar"
						css={css`
							opacity: 0.5;
							font-size: 22px;
						`}
					/>
					<div
						css={css`
							display: grid;
							gap: 0.25em;
						`}
					>
						<div
							css={css`
								font-weight: bold;
							`}
						>
							{__('Returned on', 'surecart')}
						</div>
						<ScFormatDate
							slot="price"
							type="timestamp"
							date={returnRequest?.created_at}
							month="short"
							day="numeric"
							year="numeric"
							hour="numeric"
							minute="numeric"
						/>
					</div>
				</div>

				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-large);
					`}
				>
					{(returnRequest?.return_items?.data || []).map(
						({
							id,
							line_item,
							quantity,
							return_reason,
							return_reason_description,
							note,
						}) => {
							return (
								<LineItemView
									key={id}
									imageUrl={
										line_item?.price?.product?.image_url
									}
									suffix={sprintf(
										__('Qty: %d', 'surecart'),
										quantity || 0
									)}
								>
									<a
										href={addQueryArgs('admin.php', {
											page: 'sc-products',
											action: 'edit',
											id: line_item?.price?.product?.id,
										})}
									>
										{line_item?.price?.product?.name}
									</a>
									{!!line_item?.price?.product?.weight && (
										<ScFormatNumber
											type="unit"
											value={
												line_item?.price?.product
													?.weight
											}
											unit={
												line_item?.price?.product
													?.weight_unit
											}
										/>
									)}
									<div>
										<span
											css={css`
												color: var(--sc-color-gray-600);
											`}
										>
											{__('Reason', 'surecart')}:{' '}
											{return_reason === 'other'
												? note
												: return_reason_description}
										</span>
									</div>
								</LineItemView>
							);
						}
					)}
				</div>
			</div>

			<ReturnCancelConfirmModal
				returnRequest={returnRequest}
				open={modal === 'return_cancel'}
				onRequestClose={() => setModal(false)}
				loading={loading}
			/>

			{busy && <ScBlockUi spinner />}
		</Box>
	);
};
