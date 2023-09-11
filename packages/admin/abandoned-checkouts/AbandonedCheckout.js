/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
	ScSwitch,
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
			const notificationsEnabled = e?.target?.checked || false;
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
				abandoned
			);

			const message = e.target.checked
				? __(
						'Abandoned Checkout notification has been enabled.',
						'surecart'
				  )
				: __(
						'Abandoned Checkout notification has been disabled.',
						'surecart'
				  );
			createSuccessNotice(message, { type: 'snackbar' });
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
				<div>
					<ScSwitch
						checked={abandoned?.notifications_enabled}
						onScChange={toggleNotificationEnabled}
					>
						{__('Enabled', 'surecart')}
					</ScSwitch>
				</div>
			}
			sidebar={
				<>
					<Customer
						customer={abandoned?.customer}
						loading={!hasLoadedAbandoned || busy}
					/>
					<Coupon
						promotion={abandoned?.promotion}
						coupon={abandoned?.promotion?.coupon}
						loading={!hasLoadedAbandoned || busy}
					/>
					<Schedule
						abandoned={abandoned}
						loading={!hasLoadedAbandoned || busy}
					/>
					{!!abandoned?.checkout?.shipping_address && (
						<Address
							label={__('Shipping & Tax Address', 'surecart')}
							address={abandoned?.checkout?.shipping_address}
							loading={!hasLoadedAbandoned || busy}
						/>
					)}
					<MetaData
						abandoned={abandoned}
						loading={!hasLoadedAbandoned || busy}
					/>
				</>
			}
		>
			<>
				<Details
					abandoned={abandoned}
					checkout={abandoned?.checkout}
					loading={!hasLoadedAbandoned || busy}
				/>
				{!abandoned?.recovered_checkout?.id && !busy && (
					<Link
						url={site?.url}
						checkoutId={abandoned?.checkout?.id}
						promotionCode={abandoned?.promotion?.code}
					/>
				)}
				<LineItems
					checkout={abandoned?.checkout}
					loading={!hasLoadedAbandoned || busy}
					abandoned={abandoned}
				/>
			</>
		</UpdateModel>
	);
};
