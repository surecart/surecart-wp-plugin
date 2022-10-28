/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect } from 'react';

import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
// template
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import LineItems from './modules/LineItems';
import Sidebar from './Sidebar';

export default () => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	
	const { abandoned, hasLoadedOrder, orderError } = useEntity('abandoned', id, {
		expand: [
			'recovered_checkout',
			'checkout',
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

	useEffect(() => {
		if (abandoned?.checkout) {
			receiveEntityRecords(
				'surecart',
				'checkout',
				abandoned?.checkout,
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
	}, [abandoned]);

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
						href="admin.php?page=sc-abandoned-checkouts"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-abandoned-checkouts">
							{__('Abandoned Checkout', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('View Abandoned Checkout', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			sidebar={
				<Sidebar
				abandoned={abandoned}
					checkout={abandoned?.checkout}
					customer={abandoned?.checkout?.customer}
					loading={false}
				/>
			}
		>
			<>
				<Details
					abandoned={abandoned}
					checkout={abandoned?.checkout}
					loading={false}
				/>
				<LineItems
					abandoned={abandoned}
					checkout={abandoned?.checkout}
					loading={false}
				/>
			</>
		</UpdateModel>
	);
};
