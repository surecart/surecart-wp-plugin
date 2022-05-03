import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { store } from './store';
import Sidebar from './Sidebar';
import FlashError from '../components/FlashError';

// template
import Template from '../templates/SingleModel';

import Details from './modules/Details';

import LineItems from './modules/LineItems';
import Charges from './modules/Charges';
import Subscriptions from './modules/Subscriptions';
import useCurrentPage from '../mixins/useCurrentPage';
import { useEffect } from 'react';

export default () => {
	const onSubmit = async (e) => {
		e.preventDefault();
		dispatch(store).save();
	};

	const onInvalid = () => {
		dispatch(uiStore).setInvalid(true);
	};

	const { id, order, isLoading, error, fetchOrder, getRelation } =
		useCurrentPage('order');
	const customer = getRelation('customer');
	const charge = getRelation('charge');

	useEffect(() => {
		if (id) {
			fetchOrder({
				query: {
					context: 'edit',
					expand: [
						'line_items',
						'line_item.price',
						'price.product',
						'subscription',
						'subscription.price',
						'charge',
						'charge.payment_method',
						'payment_method.card',
						'customer',
					],
				},
			});
		}
	}, [id]);

	return (
		<Template
			status={status}
			pageModelName={'orders'}
			onSubmit={onSubmit}
			onInvalid={onInvalid}
			backUrl={'admin.php?page=sc-orders'}
			backText={__('Back to All Orders', 'surecart')}
			title={
				id
					? __('Edit Order', 'surecart')
					: __('Create Order', 'surecart')
			}
			sidebar={
				<Sidebar
					order={order}
					customer={customer}
					loading={isLoading}
				/>
			}
		>
			<Fragment>
				<FlashError path="orders" scrollIntoView />
				<Details order={order} loading={isLoading} />
				<LineItems order={order} charge={charge} loading={isLoading} />
				<Charges charge={charge} loading={isLoading} />
				<Subscriptions />
			</Fragment>
		</Template>
	);
};
