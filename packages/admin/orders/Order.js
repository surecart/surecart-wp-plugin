/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { store as dataStore } from '@surecart/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import {
	ScBreadcrumbs,
	ScBreadcrumb,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import Sidebar from './Sidebar';

// template
import UpdateModel from '../templates/UpdateModel';

import Details from './modules/Details';

import LineItems from './modules/LineItems';
import Charges from './modules/Charges';
import Subscriptions from './modules/Subscriptions';
import Logo from '../templates/Logo';

import useEntity from '../hooks/useEntity';
import { useEffect } from 'react';
import { store as coreStore } from '@wordpress/core-data';

export default () => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { order, hasLoadedOrder, orderError } = useEntity('order', id, {
		expand: [
			'checkout',
			'checkout.line_items',
			'checkout.charge',
			'checkout.customer',
			'charge.payment_method',
			'checkout.tax_identifier',
			'payment_method.card',
			'line_item.price',
			'price.product',
		],
	});

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
					expand: ['payment_method', 'payment_method.card'],
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
			sidebar={
				<Sidebar
					order={order}
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
			</>
		</UpdateModel>
	);
};
