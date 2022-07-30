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

export default () => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { order, hasLoadedOrder, orderError } = useEntity('order', id, {
		expand: [
			'checkout',
			'checkout.line_items',
			'checkout.charge',
			'line_item.price',
			'price.product',
		],
	});

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
			sidebar={<Sidebar id={id} />}
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
				<Charges />
				<Subscriptions />
			</>
		</UpdateModel>
	);
};
