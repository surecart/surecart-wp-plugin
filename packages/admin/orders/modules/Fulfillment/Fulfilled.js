/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScProductLineItem,
	ScTag,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { intervalString } from '../../../util/translations';

export default ({ items }) => {
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
								items?.length,
								'surecart'
							),
							items?.length
						)}
					</ScTag>
				</div>
			}
			header_action={
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
						<ScMenuItem>
							{__('Print packing slip', 'surecart')}
						</ScMenuItem>
						<ScMenuItem
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
			}
			footer={
				<ScButton type="default">
					{__('Add Tracking', 'surecart')}
				</ScButton>
			}
		>
			{(items || []).map((item) => {
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
			})}
		</Box>
	);
};
