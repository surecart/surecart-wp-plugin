/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScCard,
	ScDashboardModule,
	ScStackedList,
	ScStackedListRow,
	ScIcon,
	ScButton,
	ScFormatDate,
	ScCcLogo,
	ScFormatNumber,
	ScSkeleton,
	ScDivider,
	ScEmpty,
	ScTag,
	ScOrderStatusBadge,
	ScPaymentMethod,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from 'react';

export default () => {
	const [orders, setOrders] = useState(0);

	useEffect(() => {
		getOrderList();
	}, []);

	const getOrderList = async () => {
		const response = await apiFetch({
			path: addQueryArgs(`surecart/v1/orders/`, {
				expand: [
					'checkout',
					'checkout.line_items',
					'checkout.charge',
					'checkout.customer',
					'checkout.payment_method',
					'payment_method.card',
					'payment_method.payment_instrument',
				],
				status: ['paid'],
				per_page: 10,
			}),
			parse: false,
		});
		const ordersList = await response.json();
		setOrders(ordersList);
	};

	function renderEmpty() {
		return (
			<div>
				<ScDivider style={{ '--spacing': '0' }}></ScDivider>
				<slot name="empty">
					<ScEmpty icon="shopping-bag">
						{__("You don't have any orders.", 'surecart')}
					</ScEmpty>
				</slot>
			</div>
		);
	}

	function renderLoading() {
		return (
			<ScCard>
				<ScStackedList>
					{[...Array(5)].map((id) => (
						<ScSkeleton
							key={id}
							style={{
								margin: '0 2%',
								width: '16%',
								display: 'inline-block',
							}}
						></ScSkeleton>
					))}
				</ScStackedList>
			</ScCard>
		);
	}

	function renderStatusBadge(order) {
		const { status, charge } = order;
		if (charge && typeof charge === 'object') {
			if (charge?.fully_refunded) {
				return (
					<ScTag type="danger">{__('Refunded', 'surecart')}</ScTag>
				);
			}
			if (charge?.refunded_amount) {
				return (
					<ScTag type="info">
						{__('Partially Refunded', 'surecart')}
					</ScTag>
				);
			}
		}

		return <ScOrderStatusBadge status={status}></ScOrderStatusBadge>;
	}

	function renderList() {
		if (orders === 0) {
			return renderLoading();
		}

		if (orders?.length === 0) {
			return renderEmpty();
		}

		return orders.map((order) => {
			const { checkout, created_at, id } = order;
			const { customer } = checkout;
			return (
				<ScStackedListRow
					style={{
						'--columns': '5',
						'--sc-list-row-background-color': 'transparent',
					}}
					href={addQueryArgs('admin.php', {
						page: 'sc-orders',
						action: 'edit',
						id: id,
					})}
				>
					<div>
						<ScFormatDate
							date={created_at}
							month="short"
							day="numeric"
							year="numeric"
							type="timestamp"
						/>
						<br />
						<span style={{ color: '#6C727F', 'font-size': '14px' }}>
							{' '}
							at{' '}
							<ScFormatDate
								date={created_at}
								hour="numeric"
								minute="numeric"
								type="timestamp"
							/>
						</span>
					</div>
					<div>
						{customer?.name}
						<br />
						<span style={{ color: '#6C727F', 'font-size': '14px' }}>
							{customer?.email}
						</span>
					</div>
					<div>{<ScOrderStatusBadge status={order?.status} />}</div>
					<div>
						<ScPaymentMethod
							paymentMethod={checkout?.payment_method}
						/>
					</div>
					<div>
						<ScFormatNumber
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						/>
					</div>
				</ScStackedListRow>
			);
		});
	}

	function renderContent() {
		return (
			<ScCard noPadding>
				<ScStackedList
					style={{ '--sc-stacked-list-row-align-items': 'center' }}
				>
					{renderList()}
				</ScStackedList>
			</ScCard>
		);
	}

	return (
		<ScDashboardModule
			css={css`
				width: 67%;

				.sc-recent-orders-wrap {
					border-radius: 5px;
				}
				@media screen and (max-width: 782px) {
					width: 100%;
				}
			`}
		>
			<span slot="heading">{__('Recent Orders', 'surecart')}</span>
			<ScButton slot="end" type="text" href={'admin.php?page=sc-orders'}>
				{__('View All', 'surecart')}
				<ScIcon slot="suffix" name="chevron-right" />
			</ScButton>
			{renderContent()}
		</ScDashboardModule>
	);
};
