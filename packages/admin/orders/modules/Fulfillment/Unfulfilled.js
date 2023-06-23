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
import { useState } from 'react';
import CreateFulfillment from './CreateFulfillment';

export default ({ items, checkout, orderId }) => {
	const [modal, setModal] = useState(false);

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
								color: var(--sc-color-warning-500);
							`}
							name={'circle'}
						/>
						{__('Unfulfilled', 'surecart')}
						<ScTag
							css={css`
								font-size: 12px;
							`}
							pill
							type={'warning'}
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
							<ScMenuItem onClick={() => setModal(true)}>
								{__('Fulfill Items', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				}
				footer={
					<ScButton type="default" onClick={() => setModal(true)}>
						{_n(
							'Fulfill item',
							'Fulfill items',
							items?.length,
							'surecart'
						)}
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
							quantity={item.quantity - item.fulfilled_quantity}
							amount={item.subtotal_amount}
							currency={item?.price?.currency}
							trialDurationDays={item?.price?.trial_duration_days}
							interval={intervalString(item?.price)}
						></ScProductLineItem>
					);
				})}
			</Box>

			<CreateFulfillment
				items={items}
				orderId={orderId}
				checkout={checkout}
				open={modal}
				onRequestClose={() => setModal(false)}
			/>
		</>
	);
};
