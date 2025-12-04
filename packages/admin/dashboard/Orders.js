/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Box from '../ui/Box';
import { addQueryArgs } from '@wordpress/url';
import {
	ScButton,
	ScIcon,
	ScOrderFulfillmentBadge,
	ScOrderStatusBadge,
	ScTable,
	ScTableCell,
	ScTableRow,
} from '@surecart/components-react';

const Cell = ({ children, muted }) => {
	return (
		<ScTableCell>
			<span
				css={css`
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
					color: ${muted ? 'var(--sc-color-gray-600)' : 'inherit'};
					font-size: var(--sc-font-size-small);
					text-align: left;
				`}
			>
				{children}
			</span>
		</ScTableCell>
	);
};

export default ({ liveMode }) => {
	const orders = useSelect((select) => {
		return select(coreStore).getEntityRecords('surecart', 'order', {
			per_page: 10,
			expand: ['checkout', 'checkout.customer'],
			live_mode: liveMode,
		});
	});

	const navigateToOrder = (id) => {
		window.location.href = addQueryArgs('admin.php', {
			page: 'sc-orders',
			action: 'edit',
			id: id,
		});
	};

	return (
		<Box
			title={__('Recent Orders', 'surecart')}
			header_action={
				<ScButton
					css={css`
						margin: -10px 0;
					`}
					type="text"
					aria-label={__('View all orders', 'surecart')}
					href="admin.php?page=sc-orders"
				>
					{__('View all', 'surecart')}
					<ScIcon name="arrow-right" slot="suffix"></ScIcon>
				</ScButton>
			}
			css={css`
				border: var(--sc-card-border);
				sc-table-cell:first-of-type {
					padding-left: 30px;
				}
				sc-table-cell:last-of-type {
					padding-right: 30px;
				}
				.components-card__body {
					padding: 0 !important;
				}
				.components-card-header {
					padding: 20px;
				}
				--sc-table-cell-spacing: var(--sc-spacing-large);
			`}
		>
			<div
				css={css`
					overflow-x: auto;
					overflow-y: hidden;
					box-sizing: border-box;
					width: 100%;
				`}
			>
				<ScTable
					style={{
						'--shadow': 'none',
						'--border-radius': '0',
						borderLeft: '0',
						borderRight: '0',
						margin: '0 -1px',
					}}
				>
					<ScTableCell
						slot="head"
						css={css`
							width: 100px;
						`}
					>
						{__('Order', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 75px;
						`}
					>
						{__('Fulfillment', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 150px;
						`}
					>
						{__('Customer', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 50px;
						`}
					>
						{__('Total', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 100px;
						`}
					>
						{__('Payment', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 125px;
						`}
					>
						{__('Date', 'surecart')}
					</ScTableCell>
					<ScTableCell
						slot="head"
						css={css`
							width: 25px;
						`}
					></ScTableCell>

					{(orders || []).map((order) => (
						<ScTableRow
							tabIndex={0}
							key={order?.id}
							onClick={() => {
								navigateToOrder(order?.id);
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									navigateToOrder(order?.id);
								}
							}}
							role="button"
							aria-label={sprintf(
								// translators: %1s is the order number, %2s is the customer name, %3s is the total amount, %4s is the order status.
								__(
									'View order number %1s by %2s for %3s. %4s',
									'surecart'
								),
								order?.number,
								order?.checkout?.customer?.name,
								order?.checkout?.total_display_amount,
								order?.status
							)}
							css={css`
								cursor: pointer;
								&:hover {
									background: var(--sc-color-gray-50);
								}
								&:focus-visible {
									outline: 1px solid
										var(--sc-color-primary-500);
								}
							`}
						>
							<Cell>
								<span
									css={css`
										font-weight: var(
											--sc-font-weight-semibold
										);
									`}
								>
									#{order?.number}
								</span>
							</Cell>
							<Cell muted>
								<ScOrderFulfillmentBadge
									status={order?.fulfillment_status}
									pill
								/>
							</Cell>
							<Cell muted>{order?.checkout?.customer?.name}</Cell>
							<Cell muted>
								{order?.checkout?.total_display_amount}
							</Cell>
							<Cell muted>
								<ScOrderStatusBadge status={order?.status} />
							</Cell>
							<Cell muted>{order?.created_at_date}</Cell>
							<Cell muted>
								<ScIcon
									aria-hidden="true"
									tabIndex={-1}
									name="chevron-right"
									css={css`
										font-size: 14px;
									`}
								/>
							</Cell>
						</ScTableRow>
					))}
				</ScTable>
			</div>
		</Box>
	);
};
