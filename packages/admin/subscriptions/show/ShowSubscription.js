/** @jsx jsx */
import useEntity from '../../hooks/useEntity';
import Logo from '../../templates/Logo';
import Template from '../../templates/UpdateModel';
import Cancel from './modules/Cancel';
import CurrentPlan from './modules/CurrentPlan';
import Customer from './modules/Customer';
import Details from './modules/Details';
import PendingUpdate from './modules/PendingUpdate';
import Periods from './modules/Periods';
import Purchases from './modules/Purchases';
import UpcomingPeriod from './modules/UpcomingPeriod';
import UpdatePending from './modules/UpdatePending';
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as uiStore } from '@surecart/ui-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);

	const { subscription, hasLoadedSubscription } = useEntity(
		'subscription',
		id,
		{
			expand: [
				'current_period',
				'period.checkout',
				'checkout.line_items',
				'line_item.price',
				'price',
				'price.product',
				'customer',
				'customer.balances',
				'purchase',
				'order',
				'payment_method',
				'payment_method.card',
			],
		}
	);

	const renderCancelButton = () => {
		if (subscription?.status === 'canceled') return null;
		if (subscription?.cancel_at_period_end) {
			return (
				<ScMenuItem
					onClick={async () => {
						setSaving(true);
						try {
							await saveSubscription({
								data: {
									cancel_at_period_end: false,
								},
								query: {
									context: 'edit',
								},
							});
							addSnackbarNotice({
								content: __('Saved.'),
							});
						} catch (e) {
							console.error(e);
							addModelErrors(
								'subscription',
								e?.message || __('Something went wrong')
							);
						} finally {
							setSaving(false);
						}
					}}
				>
					{__("Don't Cancel", 'surecart')}
				</ScMenuItem>
			);
		}

		return (
			<Cancel onCancel={() => setSaving(true)}>
				<ScMenuItem>{__('Cancel Subscription', 'surecart')}</ScMenuItem>
			</Cancel>
		);
	};

	const renderCompleteButton = () => {
		if (!subscription?.remaining_period_count) return null;
		if (subscription?.status !== 'active') return null;

		return (
			<ScMenuItem
				onClick={async () => {
					const r = confirm(
						__(
							'Are you sure you want to complete this payment plan? You cannot undo this.',
							'surecart'
						)
					);
					if (!r) return;
					try {
						setSaving(true);
						await saveSubscription({
							path: `subscriptions/${id}/complete`,
							query: {
								expand: [
									'price',
									'price.product',
									'current_period',
									'purchase',
								],
							},
						});
						addSnackbarNotice({
							content: __('Completed.'),
						});
					} catch (e) {
						console.error(e);
					} finally {
						setSaving(false);
					}
				}}
			>
				{__('Complete Subscription', 'surecart')}
			</ScMenuItem>
		);
	};

	return (
		<Template
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
						href={addQueryArgs('admin.php', {
							page: 'sc-subscriptions',
							action: 'show',
							id: id,
						})}
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-subscriptions">
							{__('Subscriptions', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Subscription Details', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			sidebar={
				<>
					<Customer
						customer={subscription?.customer}
						loading={!hasLoadedSubscription}
					/>
					<Purchases subscriptionId={id} />
				</>
			}
			button={
				<ScDropdown
					position="bottom-right"
					style={{ '--panel-width': '14em' }}
				>
					<ScButton
						type="primary"
						slot="trigger"
						loading={!hasLoadedSubscription}
						caret
					>
						{__('Actions', 'surecart')}
					</ScButton>
					<ScMenu>
						{!!Object.keys(subscription?.pending_update || {})
							.length ? (
							<UpdatePending
								id={id}
								onCancel={() => setSaving(true)}
							>
								<ScMenuItem>
									{__('Manage Pending Update', 'surecart')}
								</ScMenuItem>
							</UpdatePending>
						) : (
							subscription?.current_period_end_at !== null && (
								<ScMenuItem
									href={addQueryArgs('admin.php', {
										page: 'sc-subscriptions',
										action: 'edit',
										id: id,
									})}
								>
									{__('Update Subscription', 'surecart')}
								</ScMenuItem>
							)
						)}
						{renderCompleteButton()}
						{renderCancelButton()}
					</ScMenu>
				</ScDropdown>
			}
		>
			<>
				<Details
					subscription={subscription}
					customer={subscription?.customer}
					product={subscription?.price?.product}
					loading={!hasLoadedSubscription}
				/>

				<CurrentPlan
					lineItem={
						subscription?.current_period?.checkout?.line_items
							?.data?.[0]
					}
					subscriptionId={id}
					loading={!hasLoadedSubscription}
				/>

				{!!Object.keys(subscription?.pending_update || {}).length && (
					<PendingUpdate subscription={subscription} />
				)}

				<UpcomingPeriod
					lineItem={
						subscription?.current_period?.checkout?.line_items
							?.data?.[0]
					}
					subscriptionId={id}
					loading={!hasLoadedSubscription}
				/>

				<Periods subscriptionId={id} />
			</>
		</Template>
	);
};
