/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScProductLineItem,
	ScFulfillmentShippingStatusBadge,
	ScTag,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { intervalString } from '../../../util/translations';
import { ScFormatDate } from '@surecart/components-react';
import StatusDropdown from './StatusDropdown';

const status = {
	pending: __('Pending Shipment', 'surecart'),
	shipped: __('Shipped', 'surecart'),
	delivered: __('Delivered', 'surecart'),
};

export default ({ fulfillment }) => {
	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
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
							_n(
								'%d Item',
								'%d Items',
								fulfillment?.fulfillment_items?.data?.length,
								'surecart'
							),
							fulfillment?.fulfillment_items?.data?.length
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
				</div>
			}
			footer={
				<ScButton type="default">
					{__('Add Tracking', 'surecart')}
				</ScButton>
			}
		>
			<div
				css={css`
					display: flex;
					gap: 0.5em;
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
					<ScFormatDate
						slot="price"
						type="timestamp"
						date={fulfillment?.created_at}
						month="short"
						day="numeric"
						year="numeric"
						hour="numeric"
						minute="numeric"
					/>
				</div>
				{/* Add any tracking numbers */}
			</div>
			{/* {(items || []).map(({ id }) => {
				console.log({ item });
				return (
					<ScProductLineItem
						key={item.id}
						imageUrl={item?.price?.product?.image_url}
						name={item?.price?.product?.name}
						editable={false}
						removable={false}
						fees={item?.fees?.data}
						quantity={item.quantity}
						amount={item.subtotal_amount}
						currency={item?.price?.currency}
						trialDurationDays={item?.price?.trial_duration_days}
						interval={intervalString(item?.price)}
					></ScProductLineItem>
				);
			})} */}
		</Box>
	);
};
