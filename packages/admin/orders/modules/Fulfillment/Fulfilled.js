/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import StatusDropdown from './components/StatusDropdown';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import { ScBlockUi } from '@surecart/components-react';
import AddTracking from './components/AddTracking';
import ProductLineItem from '../../../ui/ProductLineItem';

export default ({ fulfillment, onDeleteSuccess }) => {
	const [busy, setBusy] = useState(false);
	const [modal, setModal] = useState(false);
	const { deleteEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	let total = (fulfillment?.fulfillment_items?.data || []).reduce(
		(accumulator, item) => {
			return accumulator + item?.quantity;
		},
		0
	);

	const cancelFulfillment = async () => {
		try {
			setBusy(true);
			await deleteEntityRecord(
				'surecart',
				'fulfillment',
				fulfillment.id,
				null,
				{ throwOnError: true }
			);
			invalidateResolutionForStore();
			onDeleteSuccess();
			createSuccessNotice(__('Fulfillment canceled.', 'surecart'), {
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

	const shippable = (fulfillment?.fulfillment_items?.data || []).some(
		(item) => item?.line_item?.price?.product?.shipping_enabled
	);

	return (
		<>
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
								color: var(--sc-color-success-500);
							`}
							name={'check-circle'}
						/>
						{__('Fulfilled', 'surecart')}
						<ScTag
							css={css`
								font-size: 12px;
							`}
							pill
							type={'success'}
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
							#{fulfillment?.number}
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
						<StatusDropdown
							fulfillment={fulfillment}
							placement="bottom-end"
						/>

						<ScDropdown placement="bottom-end">
							<ScButton
								circle
								type="text"
								style={{
									'--button-color':
										'var(--sc-color-gray-600)',
									margin: '-10px',
								}}
								slot="trigger"
							>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								{!!fulfillment?.trackings?.data?.length && (
									<ScMenuItem onClick={() => setModal(true)}>
										{__('Edit tracking', 'surecart')}
									</ScMenuItem>
								)}
								<ScMenuItem
									onClick={cancelFulfillment}
									css={css`
										--sc-menu-item-color: var(
											--sc-color-danger-600
										);
									`}
								>
									{__('Cancel fulfillment', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					</div>
				}
				footer={
					!fulfillment?.trackings?.data?.length &&
					shippable && (
						<ScButton type="default" onClick={() => setModal(true)}>
							{__('Add Tracking', 'surecart')}
						</ScButton>
					)
				}
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
								{__('Fulfilled on', 'surecart')}
							</div>
							{fulfillment?.created_at_date_time}
						</div>
					</div>

					{!!fulfillment?.trackings?.data?.length && (
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
								name="truck"
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
									{_n(
										'Tracking number',
										'Tracking numbers',
										fulfillment?.trackngs?.data?.length,
										'surecart'
									)}
								</div>
								{(fulfillment?.trackings?.data || []).map(
									({ number, url }) => (
										<a href={url} target="_blank">
											{number}
										</a>
									)
								)}
							</div>
						</div>
					)}

					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						{(fulfillment?.fulfillment_items?.data || []).map(
							({ id, line_item, quantity }) => (
								<ProductLineItem
									key={id}
									lineItem={line_item}
									showWeight={true}
									suffix={sprintf(
										__('Qty: %d', 'surecart'),
										quantity || 0
									)}
								/>
							)
						)}
					</div>
				</div>

				{busy && <ScBlockUi spinner />}

				<AddTracking
					open={modal}
					onRequestClose={() => setModal(false)}
					fulfillment={fulfillment}
				/>
			</Box>
		</>
	);
};
