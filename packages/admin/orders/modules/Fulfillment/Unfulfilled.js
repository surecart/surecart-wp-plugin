/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScTag,
	ScFormatNumber,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { useState } from 'react';
import LineItem from './components/LineItem';
import CreateFulfillment from './CreateFulfillment';
import { addQueryArgs } from '@wordpress/url';

export default ({ items, checkout, orderId, onCreateSuccess }) => {
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
								{_n(
									'Fulfill Item',
									'Fulfill Items',
									items?.length,
									'surecart'
								)}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				}
				footer={
					<ScButton type="default" onClick={() => setModal(true)}>
						{_n(
							'Fulfill Item',
							'Fulfill Items',
							items?.length,
							'surecart'
						)}
					</ScButton>
				}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-large);
					`}
				>
					{(items || []).map((item) => {
						return (
							<LineItem
								key={item?.id}
								imageUrl={item?.price?.product?.image_url}
								suffix={sprintf(
									__('Qty: %d', 'surecart'),
									item.quantity - item.fulfilled_quantity || 0
								)}
							>
								<a
									href={addQueryArgs('admin.php', {
										page: 'sc-products',
										action: 'edit',
										id: item?.price?.product?.id,
									})}
								>
									{item?.price?.product?.name}
								</a>
								<ScFormatNumber
									type="unit"
									value={item?.price?.product?.weight}
									unit={item?.price?.product?.weight_unit}
								/>
							</LineItem>
						);
					})}
				</div>
			</Box>

			<CreateFulfillment
				items={items}
				orderId={orderId}
				checkout={checkout}
				open={modal}
				onRequestClose={() => setModal(false)}
				onCreateSuccess={onCreateSuccess}
			/>
		</>
	);
};
