/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
	ScSwitch,
	ScBlockUi,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

import Logo from '../templates/Logo';
// template
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import LineItems from './modules/LineItems';
import Link from './components/Link';
import Schedule from './modules/Schedule';
import Customer from './modules/Customer';
import Address from './modules/Address';
import MetaData from './modules/MetaData';
import Coupon from './modules/Coupon';
import { createErrorString } from '../util';

export default () => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [busy, setBusy] = useState(false);
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
						'customer',
						'checkout.tax_identifier',
						'checkout.shipping_address',
						'checkout.billing_address',
						'checkout.discount',
						'checkout.line_items',
						'discount.promotion',
						'line_item.price',
						'line_item.fees',
						'customer.balances',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
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

	const toggleNotificationEnabled = async (e) => {
		try {
			const notificationsEnabled =
				e?.target?.checked || !abandoned?.notifications_enabled;

			setBusy(true);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'abandoned_checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${id}`, {}),
				data: {
					notifications_enabled: notificationsEnabled,
				},
			});

			receiveEntityRecords(
				'surecart',
				'abandoned_checkout',
				{
					...abandoned,
					notifications_enabled: data?.notifications_enabled,
				},
				undefined,
				false,
				{
					notifications_enabled: data?.notifications_enabled,
				}
			);

			createSuccessNotice(
				notificationsEnabled
					? __('Notifications enabled.', 'surecart')
					: __('Notifications disabled.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(createErrorString(e), { type: 'snackbar' });
		} finally {
			setBusy(false);
		}
	};

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
			button={
				abandoned?.recovery_status === 'abandoned' && (
					<div>
						<ScSwitch
							checked={abandoned?.notifications_enabled}
							onScChange={toggleNotificationEnabled}
						>
							{__('Enabled', 'surecart')}
						</ScSwitch>
					</div>
				)
			}
			sidebar={
				<>
					<Customer
						customer={abandoned?.customer}
						loading={!hasLoadedAbandoned}
					/>
					<Coupon
						promotion={abandoned?.promotion}
						coupon={abandoned?.promotion?.coupon}
						loading={!hasLoadedAbandoned}
					/>
					<Schedule
						abandoned={abandoned}
						loading={!hasLoadedAbandoned}
					/>
					{!!abandoned?.checkout?.shipping_address_display && (
						<Address
							label={__('Shipping & Tax Address', 'surecart')}
							address={
								abandoned?.checkout?.shipping_address_display
							}
							loading={!hasLoadedAbandoned}
						/>
					)}
					{!!abandoned?.checkout?.billing_address_display && (
						<Address
							label={__('Billing Address', 'surecart')}
							address={
								abandoned?.checkout?.billing_address_display
							}
							loading={!hasLoadedAbandoned}
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
				{!abandoned?.recovered_checkout?.id && (
					<Link
						url={site?.url}
						checkoutId={abandoned?.checkout?.id}
						promotionCode={abandoned?.promotion?.code}
					/>
				)}
				<LineItems
					checkout={abandoned?.checkout}
					loading={!hasLoadedAbandoned}
					abandoned={abandoned}
				/>
			</>
			{busy && (
				<ScBlockUi
					spinner
					style={{ zIndex: 9989, '--sc-block-ui-opacity': '0.35' }}
				/>
			)}
		</UpdateModel>
	);
};
