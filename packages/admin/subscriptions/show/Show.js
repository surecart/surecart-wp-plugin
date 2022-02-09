import {
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from 'react';
import FlashError from '../../components/FlashError';
import { addQueryArgs } from '@wordpress/url';

// template
import Template from '../../templates/SingleModel';
import useCurrentPage from '../../mixins/useCurrentPage';
import Details from './modules/Details';
import Invoices from './modules/Invoices';
import Pricing from './modules/Pricing';

export default () => {
	const { id, subscription, isLoading, fetchSubscription, getRelation } =
		useCurrentPage('subscription');
	const customer = getRelation('customer');
	const price = getRelation('price');
	const product = getRelation('price.product');
	const invoice = getRelation('latest_invoice');

	useEffect(() => {
		if (id) {
			fetchSubscription({
				query: {
					context: 'edit',
					expand: [
						'customer',
						'latest_invoice',
						'price',
						'price.product',
						'purchase',
						'payment_method',
						'payment_method.card',
					],
				},
			});
		}
	}, [id]);

	return (
		<Template
			pageModelName={'subscriptions'}
			backUrl={'admin.php?page=ce-subscriptions'}
			backText={__('Back to all subscriptions.', 'checkout_engine')}
			title={__('Subscription', 'checkout_engine')}
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
							<CeMenuItem>
								{__('Cancel Subscription', 'checkout_engine')}
							</CeMenuItem>
						</CeMenu>
					</CeDropdown>
				)
			}
		>
			<Fragment>
				<FlashError path="subscriptions" scrollIntoView />
				<Details
					subscription={subscription}
					customer={customer}
					product={product}
					loading={isLoading}
				/>
				<Pricing
					price={price}
					product={product}
					subscription={subscription}
				/>
				<Invoices invoice={invoice} />
			</Fragment>
		</Template>
	);
};
