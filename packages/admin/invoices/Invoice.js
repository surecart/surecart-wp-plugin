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
import Logo from '../templates/Logo';

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
				<sc-breadcrumbs>
					<sc-breadcrumb>
						<Logo display="block" />
					</sc-breadcrumb>
					<sc-breadcrumb href="admin.php?page=sc-invoices">
						{__('Invoices', 'surecart')}
					</sc-breadcrumb>
					<sc-breadcrumb>
						<sc-flex style={{ gap: '1em' }}>
							{id
								? __('Edit Invoice', 'surecart')
								: __('Create Invoice', 'surecart')}
						</sc-flex>
					</sc-breadcrumb>
				</sc-breadcrumbs>
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
