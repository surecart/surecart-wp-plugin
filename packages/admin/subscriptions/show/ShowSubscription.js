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
import { useState } from 'react';
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
import UpcomingPeriod from './modules/UpcomingPeriod';
import { useEffect } from 'react';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [modal, setModal] = useState();
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		setLoading(!hasLoadedSubscription);
	}, [hasLoadedSubscription]);

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
		if (['completed', 'canceled'].includes(subscription?.status))
			return null;

		return (
			<DatePicker
				placeholder={__('Choose date', 'surecart')}
				title={__('Pause subscription until?', 'surecart')}
				currentDate={''}
				onChoose={(date) => onPauseSubscription(date)}
				minDate={new Date()}
				required={true}
				chooseDateLabel={__('Pause subscription', 'surecart')}
			>
				<ScMenuItem>{__('Pause Subscription', 'surecart')}</ScMenuItem>
			</DatePicker>
		);
	};

	/** Render the restore at button */
	const renderRestoreAtButton = () => {
		if (subscription?.status !== 'canceled') return null;

		return (
			<DatePicker
				placeholder={__('Choose date', 'surecart')}
				title={__('Restore subscription at?', 'surecart')}
				currentDate={new Date(subscription?.restore_at * 1000)}
				onChoose={(date) => onUpdateRestoreAt(date)}
				minDate={new Date()}
				required={true}
				chooseDateLabel={__('Update subscription', 'surecart')}
			>
				<ScMenuItem>{__('Restore At...', 'surecart')}</ScMenuItem>
			</DatePicker>
		);
	};

	/** Render the renew at button */
	const renderRenewAtButton = () => {
		if (!['past_due', 'active'].includes(subscription?.status)) return null;

		return (
			<DatePicker
				placeholder={__('Choose date', 'surecart')}
				title={__('Renew subscription at?', 'surecart')}
				currentDate={
					new Date(subscription?.current_period_end_at * 1000)
				}
				onChoose={(date) => onUpdateRenewAt(date)}
				minDate={new Date()}
				required={true}
				chooseDateLabel={__('Update subscription', 'surecart')}
			>
				<ScMenuItem>{__('Renew At...', 'surecart')}</ScMenuItem>
			</DatePicker>
		);
	};

	const onRequestCloseModal = () => {
		setModal(false);
	};

	const onPauseSubscription = async (date) => {
		if (!date) {
			createErrorNotice(__('Please choose valid date.', 'surecart'), {
				type: 'snackbar',
			});
			return;
		}
		setLoading(true);
		try {
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/cancel`, {
					cancel_behavior: 'immediate',
				}),
				data: {
					restore_at: Date.parse(date) / 1000,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription paused.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	const onUpdateRestoreAt = async (date) => {
		setLoading(true);
		try {
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}`, {
					cancel_behavior: 'immediate',
				}),
				data: {
					restore_at: Date.parse(date) / 1000,
				},
			});

			await invalidateResolutionForStore();

			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	const onUpdateRenewAt = async (date) => {
		setLoading(true);
		try {
			await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/periods/${subscription?.current_period?.id}`
				),
				data: {
					end_at: date,
				},
			});

			await invalidateResolutionForStore();
			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setLoading(false);
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
						loading={loading}
					/>
					<Purchases subscriptionId={id} />
					<Tax subscription={subscription} loading={loading} />
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
						loading={loading}
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
					loading={loading}
				/>

				<CurrentPlan
					lineItem={
						subscription?.current_period?.checkout?.line_items
							?.data?.[0]
					}
					loading={loading}
					subscription={subscription}
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
					loading={loading}
				/>

				<Periods subscriptionId={id} />

				{subscription?.payment_method && (
					<PaymentMethod
						subscription={subscription}
						updateSubscription={editSubscription}
						loading={loading}
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
				open={modal === 'restore'}
				onRequestClose={onRequestCloseModal}
			/>
			{isSaving && <ScBlockUi spinner />}
		</Template>
	);
};
