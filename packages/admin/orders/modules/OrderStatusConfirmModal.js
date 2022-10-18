/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from 'react';

import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
// template
import UpdateModel from '../templates/UpdateModel';
import Charges from './modules/Charges';
import Details from './modules/Details';
import LineItems from './modules/LineItems';
import Subscriptions from './modules/Subscriptions';
import OrderStatusConfirmModal from './modules/OrderStatusConfirmModal';
import Sidebar from './Sidebar';

export default () => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { order, hasLoadedOrder, orderError } = useEntity('order', id, {
		expand: [
			'checkout',
			'checkout.charge',
			'checkout.customer',
			'checkout.tax_identifier',
			'checkout.shipping_address',
			'checkout.discount',
			'checkout.line_items',
			'discount.promotion',
			'line_item.price',
			'customer.balances',
			'price.product',
		],
	});
	const [modal, setModal] = useState();

	useEffect(() => {
		if (order?.checkout) {
			receiveEntityRecords(
				'surecart',
				'checkout',
				order?.checkout,
				{
					expand: [
						'line_items',
						'line_item.price',
						'price.product',
						'charge',
						'charge.payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
				true
			);
		}
		if (order?.checkout?.charge) {
			receiveEntityRecords(
				'surecart',
				'charge',
				order?.checkout?.charge,
				{
					checkout_ids: [order?.checkout?.id],
					expand: [
						'payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
				true
			);
		}
	}, [order]);

	useEffect(() => {
		if (orderError) {
			createErrorNotice(
				orderError?.message || __('Something went wrong', 'surecart')
			);
		}
	}, [orderError]);

	return (
		<UpdateModel
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-orders"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-orders">
							{__('Orders', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('View Order', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			button={
				<ScDropdown
					position="bottom-right"
					style={{ '--panel-width': '14em' }}
				>
					<ScButton
						type="primary"
						slot="trigger"
						caret
					>
						{__('Actions', 'surecart')}
					</ScButton>
					<ScMenu>
						<ScMenuItem
							onClick={() => setModal('order_status_update')}
						>
							{__('Mark as Paid', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			}
			sidebar={
				<Sidebar
					order={order}
					checkout={order?.checkout}
					customer={order?.checkout?.customer}
					loading={!hasLoadedOrder}
				/>
			}
		>
			<>
				<Details
					order={order}
					checkout={order?.checkout}
					loading={!hasLoadedOrder}
				/>
				<LineItems
					order={order}
					checkout={order?.checkout}
					charge={order?.checkout?.charge}
					loading={!hasLoadedOrder}
				/>
				<Charges checkoutId={order?.checkout?.id} />
				<Subscriptions checkoutId={order?.checkout?.id} />
				<OrderStatusConfirmModal
					open={modal === 'order_status_update'}
					onRequestClose={() => setModal(false)}
				/>
			</>
		</UpdateModel>
	);
};
