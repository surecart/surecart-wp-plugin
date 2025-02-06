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
	ScUpgradeRequired,
	ScPremiumTag,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from 'react';

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
import Affiliates from '../../components/affiliates';
import ForceCancelModal from './modules/modals/ForceCancelModal';
import Confirm from '../../components/confirm';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [modal, setModal] = useState();
	const [upcoming, setUpcoming] = useState();
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

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
							'product.featured_product_media',
							'product.product_medias',
							'product_media.media',
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

	const editSubscription = async (data, successMessage = null) => {
		successMessage =
			successMessage || __('Payment method updated.', 'surecart');

		try {
			await saveEntityRecord(
				'surecart',
				'subscription',
				{ id, ...data },
				{ throwOnError: true }
			);
			createSuccessNotice(successMessage, {
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
						'line_item.variant',
						'price',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
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

	useEffect(() => {
		if (id && 'canceled' !== subscription?.status) {
			fetchUpcomingPeriod();
		}
	}, [id, subscription?.discount?.id, subscription?.status]);

	/** Render the cancel button */
	const renderCancelButton = () => {
		// completed.
		if ('completed' === subscription?.status) return null;

		// canceled but not paused.
		if ('canceled' === subscription?.status && !subscription?.restore_at)
			return null;

		// scheduled for cancelation.
		if (subscription?.cancel_at_period_end && !subscription?.restore_at) {
			return (
				<>
					<ScMenuItem onClick={() => setModal('dont_cancel')}>
						{__("Don't Cancel", 'surecart')}
					</ScMenuItem>
					<ScMenuItem onClick={() => setModal('force_cancel')}>
						{__('Cancel Now', 'surecart')}
					</ScMenuItem>
				</>
			);
		}

		// paused(canceled) or scheduled paused.
		if (
			(subscription?.cancel_at_period_end ||
				subscription?.status === 'canceled') &&
			subscription?.restore_at
		) {
			return (
				<ScMenuItem onClick={() => setModal('cancel_paused')}>
					{__('Cancel Subscription', 'surecart')}
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
		if (subscription?.finite) return null;
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
		if (subscription?.finite) return null;

		if (['completed', 'canceled'].includes(subscription?.status))
			return null;

		if (subscription?.cancel_at_period_end && !subscription?.restore_at) {
			return null;
		}

		if (subscription?.cancel_at_period_end && subscription?.restore_at) {
			return (
				<ScMenuItem onClick={() => setModal('dont_cancel')}>
					{__("Don't Pause", 'surecart')}
				</ScMenuItem>
			);
		}

		const upgradeRequired =
			!window.scData?.entitlements?.subscription_restore_at;

		return (
			<ScMenuItem
				onClick={() =>
					setModal(upgradeRequired ? 'upgrade_required' : 'pause')
				}
			>
				{upgradeRequired
					? __('Pause', 'surecart')
					: __('Pause Subscription', 'surecart')}{' '}
				{upgradeRequired ? <ScPremiumTag slot="suffix" /> : null}
			</ScMenuItem>
		);
	};
	const renderPayOffButton = () => {
		if (['completed', 'canceled'].includes(subscription?.status))
			return null;

		if (!subscription?.finite) return null;

		const upgradeRequired =
			!window.scData?.entitlements?.subscription_pay_off;

		return (
			<ScMenuItem
				onClick={() =>
					setModal(upgradeRequired ? 'upgrade_required' : 'pay_off')
				}
			>
				{upgradeRequired
					? __('Pay Off', 'surecart')
					: __('Pay Off Subscription', 'surecart')}
				{upgradeRequired ? <ScPremiumTag slot="suffix" /> : null}
			</ScMenuItem>
		);
	};

	/** Render the restore at button */
	const renderRestoreAtButton = () => {
		const isSetToPause =
			!!subscription?.cancel_at_period_end &&
			!!subscription?.current_period_end_at &&
			subscription?.status !== 'canceled' &&
			!!subscription?.restore_at;

		if (subscription?.status !== 'canceled' && !isSetToPause) return null;

		return (
			<ScMenuItem onClick={() => setModal('restore_at')}>
				{__('Restore At...', 'surecart')}
			</ScMenuItem>
		);
	};

	/** Render the renew at button */
	const renderRenewAtButton = () => {
		const isSetToPause =
			!!subscription?.cancel_at_period_end &&
			!!subscription?.current_period_end_at &&
			subscription?.status !== 'canceled' &&
			!!subscription?.restore_at;
		if (isSetToPause) return null;

		if (!['past_due', 'active'].includes(subscription?.status)) return null;

		return (
			<ScMenuItem onClick={() => setModal('renew_at')}>
				{__('Change Renewal Date', 'surecart')}
			</ScMenuItem>
		);
	};

	const onRequestCloseModal = () => setModal(false);

	const onCancel = async (e) => {
		const { cancel_behavior } = await e.target.getFormJson();
		try {
			setBusy(true);
			setError(null);

			// If the subscription is already cancelled and has a restore_at date,
			// we just need to update the restore_at date to null to cancel the subscription.
			const subscriptionCancelUrl = `surecart/v1/subscriptions/${id}${
				!(
					subscription?.status === 'canceled' &&
					subscription?.restore_at
				)
					? '/cancel'
					: ''
			}`;

			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(subscriptionCancelUrl, {
					cancel_behavior,
				}),
				data: {
					restore_at: null,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(
				cancel_behavior === 'immediate'
					? __('Subscription canceled.', 'surecart')
					: __('Subscription scheduled for cancelation.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			onRequestCloseModal();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
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
					<Tax
						subscription={subscription}
						loading={!hasLoadedSubscription}
					/>
					<Affiliates
						item={subscription}
						updateItem={(data) =>
							editSubscription(
								data,
								__('Affiliate commissions updated.', 'surecart')
							)
						}
						loading={!hasLoadedSubscription}
						commissionText={__(
							'Commission On This Subscription',
							'surecart'
						)}
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

				{!!upcoming && 'canceled' !== subscription?.status && (
					<LineItems period={upcoming} loading={loadingUpcoming} />
				)}

				<Periods subscriptionId={id} />

				{(subscription?.payment_method ||
					subscription?.manual_payment) && (
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
				onCancel={onCancel}
				error={error}
				setError={setError}
				loading={!hasLoadedSubscription || busy}
			/>
			<Confirm
				open={modal === 'cancel_paused'}
				onRequestClose={onRequestCloseModal}
				error={error}
				loading={!hasLoadedSubscription || busy}
				onConfirm={() =>
					onCancel({
						target: {
							getFormJson: () => ({
								cancel_behavior: 'immediate',
							}),
						},
					})
				}
			>
				{__(
					'Are you sure? Subscription will be canceled immediately.',
					'surecart'
				)}
			</Confirm>
			<ForceCancelModal
				open={modal === 'force_cancel'}
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
				subscription={subscription}
			/>
			<PauseSubscriptionUntilModal
				open={modal === 'pause'}
				onRequestClose={onRequestCloseModal}
				currentPeriodEndAt={subscription?.current_period_end_at}
				currentPeriodEndAtDate={subscription?.current_period_end_at_date}
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
			<ScUpgradeRequired
				style={{ display: 'block' }}
				required
				open={modal === 'upgrade_required'}
				onScRequestClose={onRequestCloseModal}
			/>

			{isSaving && <ScBlockUi spinner />}
		</Template>
	);
};
