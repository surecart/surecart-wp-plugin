/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
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
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker';

import Logo from '../../templates/Logo';
import Template from '../../templates/UpdateModel';
import PaymentMethod from '../edit/modules/PaymentMethod';
import CurrentPlan from './modules/CurrentPlan';
import Customer from './modules/Customer';
import Details from './modules/Details';
import CancelSubscriptionModal from './modules/modals/CancelSubscriptionModal';
import CancelPendingUpdate from './modules/modals/CancelUpdateModal';
import CompleteSubscriptionModal from './modules/modals/CompleteSubscriptionModal';
import DontCancelModal from './modules/modals/DontCancelModal';
import RestoreSubscriptionModal from './modules/modals/RestoreSubscriptionModal';
import PendingUpdate from './modules/PendingUpdate';
import Periods from './modules/Periods';
import Purchases from './modules/Purchases';
import Tax from './modules/Tax';
import PayOffSubscriptionModal from './modules/modals/PayOffSubscriptionModal';
import LineItems from './modules/LineItems';
import RestoreSubscriptionAtModal from './modules/modals/RestoreSubscriptionAtModal';
import PauseSubscriptionUntilModal from './modules/modals/PauseSubscriptionUntilModal';
import RenewSubscriptionAtModal from './modules/modals/RenewSubscriptionAtModal';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [modal, setModal] = useState();
	const [upcoming, setUpcoming] = useState();
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	useEffect(() => {
		if (id) {
			fetchUpcomingPeriod();
		}
	}, [id]);

	const fetchUpcomingPeriod = async () => {
		setLoadingUpcoming(true);
		try {
			const response = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/subscriptions/${id}/upcoming_period`,
					{
						skip_product_group_validation: true,
						expand: [
							'period.checkout',
							'checkout.line_items',
							'line_item.price',
							'price.product',
							'period.subscription',
						],
					}
				),
				data: {
					purge_pending_update: false,
				},
			});
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setLoadingUpcoming(false);
		}
	};

	const editSubscription = async (data) => {
		try {
			await saveEntityRecord(
				'surecart',
				'subscription',
				{ id, ...data },
				{ throwOnError: true }
			);
			createSuccessNotice(__('Payment method updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
			if (e?.additional_errors?.length) {
				e.additional_errors.forEach(
					({ message }) =>
						message &&
						createErrorNotice(message, { type: 'snackbar' })
				);
			}
		}
	};

	const { subscription, hasLoadedSubscription, isSaving } = useSelect(
		(select) => {
			if (!id) return;
			const queryArgs = [
				'surecart',
				'subscription',
				{
					ids: [id],
					expand: [
						'current_period',
						'period.checkout',
						'checkout.line_items',
						'line_item.price',
						'line_item.fees',
						'price',
						'price.product',
						'customer',
						'customer.balances',
						'purchase',
						'discount',
						'discount.coupon',
						'order',
						'current_cancellation_act',
						'payment_method',
						'payment_method.card',
						'payment_method.payment_instrument',
						'payment_method.paypal_account',
						'payment_method.bank_account',
					],
				},
			];

			return {
				subscription: select(coreStore).getEntityRecords(
					...queryArgs
				)?.[0],
				hasLoadedSubscription: select(coreStore).hasFinishedResolution(
					'getEntityRecords',
					queryArgs
				),
				isSaving: select(coreStore)?.isSavingEntityRecord?.(
					'surecart',
					'subscription',
					id
				),
			};
		},
		[id]
	);

	/** Render the cancel button */
	const renderCancelButton = () => {
		if (
			subscription?.status === 'canceled' ||
			subscription?.status === 'completed'
		)
			return null;
		if (subscription?.cancel_at_period_end) {
			return (
				<ScMenuItem onClick={() => setModal('dont_cancel')}>
					{__("Don't Cancel", 'surecart')}
				</ScMenuItem>
			);
		}
		return (
			<ScMenuItem onClick={() => setModal('cancel')}>
				{__('Cancel Subscription', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the complete button */
	const renderCompleteButton = () => {
		// bail if not finite.
		if (!subscription?.finite) return null;
		return (
			<ScMenuItem
				onClick={(e) => {
					setModal(e.target.disabled ? null : 'complete');
				}}
				disabled={subscription?.status === 'completed'}
			>
				{__('Complete Subscription', 'surecart')}
			</ScMenuItem>
		);
	};
	/** Render the restore button */
	const renderRestoreButton = () => {
		if (subscription?.status !== 'canceled') return null;
		return (
			<ScMenuItem onClick={() => setModal('restore')}>
				{__('Restore Now', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the update button */
	const renderUpdateButton = () => {
		if (!!Object.keys(subscription?.pending_update || {})?.length)
			return null;
		if (['completed', 'canceled'].includes(subscription?.status))
			return null;
		if (!subscription?.finite) return null;
		return (
			<ScMenuItem
				href={addQueryArgs('admin.php', {
					page: 'sc-subscriptions',
					action: 'edit',
					id: id,
				})}
			>
				{__('Update Subscription', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the pause button */
	const renderPauseButton = () => {
		if (['completed', 'canceled'].includes(subscription?.status))
			return null;

		return (
			<ScMenuItem onClick={() => setModal('pause')}>
				{__('Pause Subscription', 'surecart')}
			</ScMenuItem>
		);
	};
	const renderPayOffButton = () => {
		if (['completed', 'canceled'].includes(subscription?.status))
			return null;

		if (!subscription?.finite) return null;

		return (
			<ScMenuItem onClick={() => setModal('pay_off')}>
				{__('Pay Off Subscription', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the restore at button */
	const renderRestoreAtButton = () => {
		if (subscription?.status !== 'canceled') return null;

		return (
			<ScMenuItem onClick={() => setModal('restore_at')}>
				{__('Restore At...', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the renew at button */
	const renderRenewAtButton = () => {
		if (!['past_due', 'active'].includes(subscription?.status)) return null;

		return (
			<ScMenuItem onClick={() => setModal('renew_at')}>
				{__('Renew At...', 'surecart')}
			</ScMenuItem>
		);
	};

	const onRequestCloseModal = () => setModal(false);

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
					<Tax
						subscription={subscription}
						loading={!hasLoadedSubscription}
					/>
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
							.length && (
							<ScMenuItem
								onClick={() => setModal('cancel_update')}
							>
								{__('Cancel Pending Update', 'surecart')}
							</ScMenuItem>
						)}
						{renderUpdateButton()}
						{renderRenewAtButton()}
						{renderPauseButton()}
						{renderPayOffButton()}
						{renderCompleteButton()}
						{renderCancelButton()}
						{renderRestoreAtButton()}
						{renderRestoreButton()}
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
					loading={!hasLoadedSubscription}
					subscription={subscription}
				/>

				{!!Object.keys(subscription?.pending_update || {}).length && (
					<PendingUpdate subscription={subscription} />
				)}

				<LineItems period={upcoming} loading={loadingUpcoming} />

				<Periods subscriptionId={id} />

				{subscription?.payment_method && (
					<PaymentMethod
						subscription={subscription}
						updateSubscription={editSubscription}
						loading={!hasLoadedSubscription}
					/>
				)}
			</>

			<CancelPendingUpdate
				open={modal === 'cancel_update'}
				onRequestClose={onRequestCloseModal}
			/>
			<CancelSubscriptionModal
				subscription={subscription}
				open={modal === 'cancel'}
				onRequestClose={onRequestCloseModal}
			/>
			<DontCancelModal
				open={modal === 'dont_cancel'}
				onRequestClose={onRequestCloseModal}
			/>
			<CompleteSubscriptionModal
				open={modal === 'complete'}
				onRequestClose={onRequestCloseModal}
			/>
			<RestoreSubscriptionModal
				amountDue={upcoming?.checkout?.amount_due}
				currency={upcoming?.checkout?.currency}
				open={modal === 'restore'}
				onRequestClose={onRequestCloseModal}
			/>

			<RestoreSubscriptionAtModal
				open={modal === 'restore_at'}
				onRequestClose={onRequestCloseModal}
				currentRestoreAt={subscription?.restore_at}
			/>
			<PauseSubscriptionUntilModal
				open={modal === 'pause'}
				onRequestClose={onRequestCloseModal}
			/>
			<RenewSubscriptionAtModal
				open={modal === 'renew_at'}
				onRequestClose={onRequestCloseModal}
				subscription={subscription}
			/>
			<PayOffSubscriptionModal
				open={modal === 'pay_off'}
				onRequestClose={onRequestCloseModal}
			/>
			{isSaving && <ScBlockUi spinner />}
		</Template>
	);
};
