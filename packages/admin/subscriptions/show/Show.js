import {
	CeBlockUi,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { store as uiStore } from '@surecart/ui-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Fragment, useEffect } from 'react';

import ErrorFlash from '../../components/ErrorFlash';
import useCurrentPage from '../../mixins/useCurrentPage';
import Logo from '../../templates/Logo';
// template
import Template from '../../templates/SingleModel';
import Cancel from './modules/Cancel';
import Details from './modules/Details';
import Invoices from './modules/Invoices';
import Orders from './modules/Orders';
import PendingUpdate from './modules/PendingUpdate';
import Pricing from './modules/Pricing';
import UpdatePending from './modules/UpdatePending';
import Sidebar from './Sidebar';

export default () => {
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);

	const {
		id,
		subscription,
		isLoading,
		fetchSubscription,
		getRelation,
		saveSubscription,
		isSaving,
		setSaving,
		subscriptionErrors,
		clearSubscriptionErrors,
	} = useCurrentPage('subscription', {
		query: {
			context: 'edit',
			expand: [
				'customer',
				'price',
				'price.product',
				'purchase',
				'order',
				'payment_method',
				'payment_method.card',
			],
		},
	});

	const customer = getRelation('customer');
	const price = getRelation('price');
	const order = getRelation('order');
	const product = getRelation('price.product');

	useEffect(() => {
		if (id) {
			doFetch();
		}
	}, [id]);

	const doFetch = () => {
		fetchSubscription({
			query: {
				context: 'edit',
				expand: [
					'customer',
					'price',
					'order',
					'price.product',
					'purchase',
					'payment_method',
					'payment_method.card',
				],
			},
		});
	};

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
									'latest_invoice',
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
			pageModelName={'subscriptions'}
			backUrl={'admin.php?page=sc-subscriptions'}
			backText={__('Back to all subscriptions.', 'surecart')}
			title={
				<sc-breadcrumbs>
					<sc-breadcrumb>
						<Logo display="block" />
					</sc-breadcrumb>
					<sc-breadcrumb href="admin.php?page=sc-subscriptions">
						{__('Subscriptions', 'surecart')}
					</sc-breadcrumb>
					<sc-breadcrumb>
						<sc-flex style={{ gap: '1em' }}>
							{__('Subscription', 'surecart')}
						</sc-flex>
					</sc-breadcrumb>
				</sc-breadcrumbs>
			}
			sidebar={<Sidebar loading={isLoading} />}
			button={
				isLoading ? (
					<sc-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				) : (
					<ScDropdown
						position="bottom-right"
						style={{ '--panel-width': '14em' }}
					>
						<ScButton
							type="primary"
							slot="trigger"
							loading={isSaving}
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
										{__(
											'Manage Pending Update',
											'surecart'
										)}
									</ScMenuItem>
								</UpdatePending>
							) : (
								subscription?.current_period_end_at !==
									null && (
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
				)
			}
		>
			<Fragment>
				<ErrorFlash
					errors={subscriptionErrors}
					onHide={clearSubscriptionErrors}
				/>

				<Details
					subscription={subscription}
					customer={customer}
					product={product}
					loading={isLoading}
				/>

				<Pricing
					price={price}
					product={product}
					loading={isLoading}
					subscription={subscription}
				/>

				{!!Object.keys(subscription?.pending_update || {}).length && (
					<PendingUpdate subscription={subscription} />
				)}

				<Orders order={order} loading={isLoading} />

				<Invoices subscriptionId={id} subscription={subscription} />

				{isSaving && (
					<sc-block-ui
						spinner
						style={{ zIndex: 9, margin: 0 }}
					></sc-block-ui>
				)}
			</Fragment>
		</Template>
	);
};
