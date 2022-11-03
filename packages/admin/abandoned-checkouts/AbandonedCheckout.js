/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
	ScInput,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect } from 'react';
import { addQueryArgs } from '@wordpress/url';

import Logo from '../templates/Logo';
// template
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import LineItems from './modules/LineItems';
import Sidebar from './Sidebar';
import Link from './components/Link';
import Schedule from './modules/Schedule';
import Customer from './modules/Customer';
import Address from './modules/Address';
import MetaData from './modules/MetaData';

export default () => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const id = useSelect((select) => select(dataStore).selectPageId());

	const { abandoned, hasLoadedAbandoned, loadError } = useSelect(
		(select) => {
			if (!id) {
				return {};
			}
			const entityData = [
				'surecart',
				'abandoned_checkout',
				id,
				{
					expand: [
						'promotion',
						'promotion.coupon',
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
				},
			];

			return {
				abandoned: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				hasLoadedAbandoned: select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
				loadError: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
			};
		},
		[id]
	);

	const site = useSelect((select) =>
		select(coreStore).getEntityRecord('root', 'site')
	);

	useEffect(() => {
		if (loadError) {
			createErrorNotice(
				loadError?.message || __('Something went wrong', 'surecart')
			);
		}
	}, [loadError]);

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
				<>
					<Customer
						customer={abandoned?.checkout?.customer}
						loading={!hasLoadedAbandoned}
					/>
					<Schedule
						abandoned={abandoned}
						loading={!hasLoadedAbandoned}
					/>
					{!!abandoned?.checkout?.shipping_address && (
						<Address
							label={__('Shipping & Tax Address', 'surecart')}
							address={abandoned?.checkout?.shipping_address}
						/>
					)}
					<MetaData
						abandoned={abandoned}
						loading={!hasLoadedAbandoned}
					/>
				</>
			}
		>
			<>
				<Details
					abandoned={abandoned}
					checkout={abandoned?.checkout}
					loading={!hasLoadedAbandoned}
				/>
				<Link
					url={site?.url}
					checkoutId={abandoned?.checkout?.id}
					promotionId={abandoned?.promotion?.id}
				/>
				<LineItems
					checkout={abandoned?.checkout}
					loading={!hasLoadedAbandoned}
				/>
			</>
		</UpdateModel>
	);
};
