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
import Pricing from './modules/Pricing';
import Cancel from './modules/Cancel';
import Sidebar from './Sidebar';
import PendingUpdate from './modules/PendingUpdate';

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
				'payment_method',
				'payment_method.card',
			],
		},
	});

	const customer = getRelation('customer');
	const price = getRelation('price');
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
					{__("Don't Cancel", 'checkout_engine')}
				</CeMenuItem>
			);
		}

		return (
			<Cancel
				id={id}
				onCancel={() => setSaving(true)}
				onCanceled={doFetch}
			>
				<CeMenuItem>
					{__('Cancel Subscription', 'checkout_engine')}
				</CeMenuItem>
			</Cancel>
		);
	};

	return (
		<Template
			pageModelName={'subscriptions'}
			backUrl={'admin.php?page=ce-subscriptions'}
			backText={__('Back to all subscriptions.', 'checkout_engine')}
			title={__('Subscription', 'checkout_engine')}
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
							{__('Actions', 'checkout_engine')}
						</CeButton>
						<CeMenu>
							<CeMenuItem
								href={addQueryArgs('admin.php', {
									page: 'ce-subscriptions',
									action: 'edit',
									id: id,
								})}
							>
								{__('Update Subscription', 'checkout_engine')}
							</CeMenuItem>
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
