/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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

	const { id, invoice, isLoading, error, fetchInvoice, getRelation } =
		useCurrentPage('invoice');
	const customer = getRelation('customer');
	const charge = getRelation('charge');
	const subscription = getRelation('subscription');

	useEffect(() => {
		if (id) {
			fetchInvoice({
				query: {
					context: 'edit',
					expand: [
						'invoice_items',
						'invoice_item.price',
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
			pageModelName={'invoices'}
			onSubmit={onSubmit}
			onInvalid={onInvalid}
			backUrl={'admin.php?page=sc-invoices'}
			backText={__('Back to All Invoices', 'surecart')}
			title={
				id
					? __('Edit Invoice', 'surecart')
					: __('Create Invoice', 'surecart')
			}
			sidebar={<Sidebar customer={customer} loading={isLoading} />}
		>
			<Fragment>
				<FlashError path="invoices" scrollIntoView />
				<Details invoice={invoice} loading={isLoading} />
				<LineItems
					invoice={invoice}
					charge={charge}
					loading={isLoading}
				/>
				<Charges charge={charge} loading={isLoading} />
				<Subscriptions
					subscription={subscription}
					loading={isLoading}
				/>
			</Fragment>
		</Template>
	);
};
