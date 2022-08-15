/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex } from '@surecart/components-react';
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

export default ({ liveMode }) => {
	const [orders, setOrders] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getOrderList();
	}, [liveMode]);

	const getOrderList = async () => {
		try {
			setLoading(true);
			const ordersList = await apiFetch({
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
					live_mode: liveMode,
					per_page: 10,
				}),
			});
			setOrders(ordersList);
		} catch (e) {
		} finally {
			setLoading(false);
		}
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
			<ScStackedList>
				<ScStackedListRow
					style={{
						'--columns': '1',
						'--sc-list-row-background-color': 'transparent',
					}}
				>
					<ScFlex
						flexDirection="column"
						style={{ '--sc-flex-column-gap': '1em' }}
					>
						<ScSkeleton
							style={{
								width: '40%',
								display: 'inline-block',
							}}
						></ScSkeleton>
						<ScSkeleton
							style={{
								width: '60%',
								display: 'inline-block',
							}}
						></ScSkeleton>
						<ScSkeleton
							style={{
								width: '30%',
								display: 'inline-block',
							}}
						></ScSkeleton>
					</ScFlex>
				</ScStackedListRow>
			</ScStackedList>
		);
	}

	function renderList() {
		if (loading) {
			return renderLoading();
		}

		if (orders?.length === 0) {
			return renderEmpty();
		}

		return (orders || []).map((order) => {
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
					<ScFlex style={{ '--sc-flex-column-gap': '0.35em' }}>
						<ScFormatNumber
							type="currency"
							currency={checkout?.currency}
							value={checkout?.amount_due}
						/>
						{!order?.checkout?.live_mode && (
							<ScTag type="warning" size="small">
								{__('Test', 'surecart')}
							</ScTag>
						)}
					</ScFlex>
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
