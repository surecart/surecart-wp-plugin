/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { store as dataStore } from '@surecart/data';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import Sidebar from './Sidebar';

// template
import UpdateModel from '../templates/UpdateModel';

import Details from './modules/Details';

import LineItems from './modules/LineItems';
import Charges from './modules/Charges';
import Subscriptions from './modules/Subscriptions';
import Logo from '../templates/Logo';
import Error from '../components/Error';
import {
	ScBreadcrumbs,
	ScBreadcrumb,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import useEntity from '../hooks/useEntity';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { order, hasLoadedOrder, orderError } = useEntity('order', id, {
		expand: ['line_items', 'line_item.price', 'price.product'],
	});

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
				<Error error={orderError} margin="80px" />
				<Details order={order} loading={!hasLoadedOrder} />
				<LineItems
					order={order}
					charge={order?.charge}
					loading={!hasLoadedOrder}
				/>
				<Charges />
				<Subscriptions />
			</>
		</UpdateModel>
	);
};
