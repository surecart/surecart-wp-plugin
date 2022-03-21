import {
	CeBlockUi,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from 'react';
import ErrorFlash from '../../components/ErrorFlash';
import { addQueryArgs } from '@wordpress/url';

// template
import Template from '../../templates/SingleModel';
import useCurrentPage from '../../mixins/useCurrentPage';
import Details from './modules/Details';
import Invoices from './modules/Invoices';
import Orders from './modules/Orders';
import Pricing from './modules/Pricing';
import Cancel from './modules/Cancel';
import Sidebar from './Sidebar';
import PendingUpdate from './modules/PendingUpdate';
import UpdatePending from './modules/UpdatePending';

export default () => {
	const {
		id,
		subscription,
		isLoading,
		fetchSubscription,
		getRelation,
		saveSubscription,
		isSaving,
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

	console.log({ order });

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
				<CeMenuItem
					onClick={async () => {
						saveSubscription({
							data: {
								cancel_at_period_end: false,
							},
							query: {
								context: 'edit',
							},
						});
					}}
				>
					{__("Don't Cancel", 'surecart')}
				</CeMenuItem>
			);
		}

		return (
			<Cancel onCancel={() => setSaving(true)}>
				<CeMenuItem>{__('Cancel Subscription', 'surecart')}</CeMenuItem>
			</Cancel>
		);
	};

	return (
		<Template
			pageModelName={'subscriptions'}
			backUrl={'admin.php?page=ce-subscriptions'}
			backText={__('Back to all subscriptions.', 'surecart')}
			title={__('Subscription', 'surecart')}
			sidebar={<Sidebar loading={isLoading} />}
			button={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<CeDropdown position="bottom-right">
						<CeButton type="primary" slot="trigger" caret>
							{__('Actions', 'surecart')}
						</CeButton>
						<CeMenu>
							{!!Object.keys(subscription?.pending_update || {})
								.length ? (
								<UpdatePending
									id={id}
									onCancel={() => setSaving(true)}
								>
									<CeMenuItem>
										{__(
											'Manage Pending Update',
											'surecart'
										)}
									</CeMenuItem>
								</UpdatePending>
							) : (
								subscription?.current_period_end_at !==
									null && (
									<CeMenuItem
										href={addQueryArgs('admin.php', {
											page: 'ce-subscriptions',
											action: 'edit',
											id: id,
										})}
									>
										{__('Update Subscription', 'surecart')}
									</CeMenuItem>
								)
							)}
							{renderCancelButton()}
						</CeMenu>
					</CeDropdown>
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
					<ce-block-ui
						spinner
						style={{ zIndex: 9, margin: 0 }}
					></ce-block-ui>
				)}
			</Fragment>
		</Template>
	);
};
