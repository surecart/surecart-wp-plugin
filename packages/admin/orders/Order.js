/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
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
import Refund from '../components/data-tables/charges-data-table/Refund';

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
					'checkout.selected_shipping_choice',
					'shipping_choice.shipping_method',
					'discount.promotion',
					'line_item.price',
					'line_item.fees',
					'line_item.variant',
					'customer.balances',
					'price.product',
					'variant.image',
				],
				t: Date.now(), // prevents cache.
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
						'checkout.billing_address',
						'checkout.discount',
						'checkout.line_items',
						'checkout.selected_shipping_choice',
						'checkout.invoice',
						'shipping_choice.shipping_method',
						'discount.promotion',
						'line_item.price',
						'line_item.fees',
						'line_item.variant',
						'customer.balances',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
						'variant.image',
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

	const chargeId = order?.checkout?.charge?.id;
	const { refunds, refundsLoading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'refund',
				{
					context: 'edit',
					charge_ids: [chargeId],
					per_page: 100,
					expand: [
						'refund_items',
						'refund_item.line_item',
						'line_item.price',
						'line_item.variant',
						'variant.image',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
					],
				},
			];
			const refunds = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				refunds,
				refundsLoading: loading,
			};
		},
		[chargeId]
	);

	const { returnRequests, returnRequestsLoading } = useSelect(
		(select) => {
			if (!order?.id) {
				return {
					returnRequests: [],
					returnRequestsLoading: false,
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
						'line_item.variant',
						'price.product',
						'product.featured_product_media',
						'product_media.media',
						'variant.image',
					],
				},
			];
			return {
				returnRequests: select(coreStore).getEntityRecords(
					...queryArgs
				),
				returnRequestsLoading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[order?.id]
	);

	const fulfilledItems =
		order?.checkout?.line_items?.data?.filter(
			(item) =>
				item?.quantity === item?.fulfilled_quantity ||
				(item?.fulfilled_quantity > 0 &&
					item?.quantity !== item?.fulfilled_quantity)
		) || [];

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

		const totalReturnQty = returnRequests?.reduce(
			(total, returnRequest) =>
				total +
				returnRequest?.return_items?.data?.reduce(
					(total, returnItem) => total + returnItem?.quantity,
					0
				),
			0
		);

		const totalFulfilledItemsQty = fulfilledItems?.reduce(
			(total, item) => total + item?.fulfilled_quantity,
			0
		);

		if (totalFulfilledItemsQty > totalReturnQty) {
			menuItems.push({
				title: __('Return', 'surecart'),
				modal: 'return_request',
			});
		}

		// Add refund option if only one charge is present.
		// For multiple charges, refund should be done from the charges table individually.
		if (order?.checkout?.charges?.data?.length === 1) {
			menuItems.push({
				title: __('Refund', 'surecart'),
				modal: 'refund',
			});
		}

		return menuItems;
	};

	const menuItems = getMenuItems(order?.status);

	const [refundCharge, setRefundCharge] = useState(
		order?.checkout?.charges?.data?.[0]
	);
	useEffect(() => {
		setRefundCharge(order?.checkout?.charges?.data?.[0]);
	}, [order?.checkout?.charges?.data]);

	const onRefunded = () => {
		// invalidateCharges();
		setRefundCharge(false);
		setModal(false);
	};

	const checkoutId = order?.checkout?.id;
	const { purchases, loadingPurchases } = useSelect(
		(select) => {
			if (!checkoutId) {
				return {
					purchases: [],
					loading: true,
				};
			}
			const entityData = [
				'surecart',
				'purchase',
				{
					checkout_ids: checkoutId ? [checkoutId] : null,
					expand: ['product', 'line_item', 'line_item.price'],
				},
			];
			return {
				purchases: select(coreStore)?.getEntityRecords?.(...entityData),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[checkoutId]
	);

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
					onManuallyRefetchOrder={manuallyRefetchOrder}
				/>
			}
		>
			<>
				<Details
					order={order}
					checkout={order?.checkout}
					loading={!hasLoadedOrder}
					returnRequests={returnRequests}
				/>

				{(returnRequests || []).map((returnRequest, index) => (
					<ReturnItems
						key={index}
						loading={returnRequestsLoading}
						returnRequest={returnRequest}
						checkout={order?.checkout}
						onCreateSuccess={manuallyRefetchOrder}
						onChangeRequestStatus={manuallyRefetchOrder}
					/>
				))}

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
					refunds={refunds}
				/>
				<Charges
					checkoutId={checkoutId}
					purchases={purchases}
					refunds={refunds}
					refundsLoading={refundsLoading}
				/>
				<PaymentFailures
					failures={order?.checkout?.payment_failures}
					loading={!hasLoadedOrder}
				/>
				<Refunds
					chargeId={order?.checkout?.charge?.id}
					refunds={refunds}
					loading={refundsLoading}
				/>
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
					returnRequests={returnRequests}
					orderId={order?.id}
					checkout={order?.checkout}
					open={modal === 'return_request'}
					onRequestClose={() => setModal(false)}
					onCreateSuccess={manuallyRefetchOrder}
				/>

				{modal === 'refund' && (
					<Refund
						charge={refundCharge}
						purchases={purchases}
						refunds={refunds}
						refundsLoading={refundsLoading}
						onRefunded={onRefunded}
						onRequestClose={() => {
							setRefundCharge(false);
							setModal(false);
						}}
					/>
				)}
			</>
		</UpdateModel>
	);
};
