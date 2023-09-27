/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Charges from './modules/Charges';
import Details from './modules/Details';
import LineItems from './modules/LineItems';
import OrderCancelConfirmModal from './modules/OrderCancelConfirmModal';
import OrderStatusConfirmModal from './modules/OrderStatusConfirmModal';
import PaymentFailures from './modules/PaymentFailures';
import Refunds from './modules/Refunds';
import Subscriptions from './modules/Subscriptions';
import Sidebar from './Sidebar';
import Fulfillment from './modules/Fulfillment';
import CreateReturnRequest from './modules/ReturnRequest/CreateReturnRequest';
import ReturnItems from './modules/ReturnRequest/ReturnItems';

export default () => {
	const [modal, setModal] = useState();
	const id = useSelect((select) => select(dataStore).selectPageId());

	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	/** This is a workaround until we can sort out why store invalidation is not working for order. */
	const manuallyRefetchOrder = async () => {
		const { baseURL } = select(coreStore).getEntityConfig(
			'surecart',
			'order'
		);
		const order = await apiFetch({
			method: 'GET',
			path: addQueryArgs(`${baseURL}/${id}`, {
				context: 'edit',
				expand: [
					'checkout',
					'checkout.charge',
					'checkout.customer',
					'checkout.tax_identifier',
					'checkout.payment_failures',
					'checkout.shipping_address',
					'checkout.discount',
					'checkout.line_items',
					'discount.promotion',
					'line_item.price',
					'line_item.fees',
					'customer.balances',
					'price.product',
				],
			}),
		});

		receiveEntityRecords('surecart', 'order', order);
	};

	const { order, hasLoadedOrder, orderError } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'order',
				id,
				{
					expand: [
						'checkout',
						'checkout.charge',
						'checkout.customer',
						'checkout.tax_identifier',
						'checkout.payment_failures',
						'checkout.shipping_address',
						'checkout.discount',
						'checkout.line_items',
						'discount.promotion',
						'line_item.price',
						'line_item.fees',
						'customer.balances',
						'price.product',
					],
				},
			];
			return {
				order: select(coreStore)?.getEntityRecord?.(...queryArgs),
				hasLoadedOrder: select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecord',
					[...queryArgs]
				),
				orderError: select(coreStore)?.getResolutionError?.(
					'getEntityRecord',
					...queryArgs
				),
			};
		},
		[id]
	);

	const { returnRequest, returnRequestLoading } = useSelect(
		(select) => {
			if (!order?.id) {
				return {
					returnRequest: null,
					returnRequestLoading: false,
				};
			}

			const queryArgs = [
				'surecart',
				'return_request',
				{
					order_ids: [order?.id],
					expand: [
						'return_items',
						'return_item.line_item',
						'line_item.price',
						'price.product',
					],
				},
			];
			return {
				returnRequest: select(coreStore).getEntityRecords(
					...queryArgs
				)?.[0],
				returnRequestLoading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[order?.id]
	);

	const fulfilledItems = order?.checkout?.line_items?.data?.filter(
		(item) => item?.quantity === item?.fulfilled_quantity
	);

	useEffect(() => {
		if (orderError) {
			createErrorNotice(
				orderError?.message || __('Something went wrong', 'surecart')
			);
		}
	}, [orderError]);

	const getMenuItems = (orderStatus) => {
		const menuItems = [];

		if (!['draft', 'paid'].includes(orderStatus)) {
			menuItems.push({
				title: __('Mark As Paid', 'surecart'),
				modal: 'order_status_update',
			});
		}

		if (['draft', 'processing', 'paid'].includes(orderStatus)) {
			menuItems.push({
				title: __('Cancel Order', 'surecart'),
				modal: 'order_cancel',
			});
		}

		// If there are fulfilled items and not already returned,
		// then enable the Return action.
		if ((fulfilledItems || []).length && !returnRequest?.id) {
			menuItems.push({
				title: __('Return', 'surecart'),
				modal: 'return_request',
			});
		}

		return menuItems;
	};

	const menuItems = getMenuItems(order?.status);

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
							{__('View Order', 'surecart')}
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			button={
				<ScDropdown
					position="bottom-right"
					style={{ '--panel-width': '14em' }}
				>
					{menuItems.length > 0 && (
						<>
							<ScButton
								type="primary"
								slot="trigger"
								caret
								loading={!hasLoadedOrder}
							>
								{__('Actions', 'surecart')}
							</ScButton>
							<ScMenu>
								{menuItems.map((menuItem, key) => (
									<ScMenuItem
										onClick={() => setModal(menuItem.modal)}
										key={key}
									>
										{menuItem.title}
									</ScMenuItem>
								))}
							</ScMenu>
						</>
					)}
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
					returnRequest={returnRequest}
				/>
				<ReturnItems
					loading={returnRequestLoading}
					returnRequest={returnRequest}
					checkout={order?.checkout}
					onCreateSuccess={manuallyRefetchOrder}
					onChangeRequestStatus={manuallyRefetchOrder}
				/>
				<Fulfillment
					loading={!hasLoadedOrder}
					orderId={id}
					checkout={order?.checkout}
					onCreateSuccess={manuallyRefetchOrder}
					onDeleteSuccess={manuallyRefetchOrder}
				/>
				<LineItems
					order={order}
					checkout={order?.checkout}
					charge={order?.checkout?.charge}
					loading={!hasLoadedOrder}
				/>
				<Charges checkoutId={order?.checkout?.id} />
				<PaymentFailures
					failures={order?.checkout?.payment_failures}
					loading={!hasLoadedOrder}
				/>
				<Refunds chargeId={order?.checkout?.charge?.id} />
				<Subscriptions checkoutId={order?.checkout?.id} />
				<OrderStatusConfirmModal
					order={order}
					open={modal === 'order_status_update'}
					onRequestClose={() => setModal(false)}
					loading={!hasLoadedOrder}
				/>
				<OrderCancelConfirmModal
					order={order}
					open={modal === 'order_cancel'}
					onRequestClose={() => setModal(false)}
					loading={!hasLoadedOrder}
				/>
				<CreateReturnRequest
					fulfillmentItems={fulfilledItems}
					orderId={order?.id}
					checkout={order?.checkout}
					open={modal === 'return_request'}
					onRequestClose={() => setModal(false)}
					onCreateSuccess={manuallyRefetchOrder}
				/>
			</>
		</UpdateModel>
	);
};
