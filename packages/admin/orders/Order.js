/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { store } from './store';
import Sidebar from './Sidebar';
import SaveButton from '../components/SaveButton';
import FlashError from '../components/FlashError';

// template
import Template from '../templates/SingleModel';

import Details from './modules/Details';

import useSnackbar from '../hooks/useSnackbar';
import useOrderData from './hooks/useOrderData';
import LineItems from './modules/LineItems';
import Charges from './modules/Charges';
import Subscriptions from './modules/Subscriptions';
import useCurrentPage from '../mixins/useCurrentPage';
import { useEffect, useRef } from 'react';

export default () => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();
	const { order, loading } = useOrderData();

	const onSubmit = async (e) => {
		e.preventDefault();
		dispatch(store).save();
	};

	const onInvalid = () => {
		dispatch(uiStore).setInvalid(true);
	};

	const { id, model, isLoading, error, fetchModel } = useCurrentPage('order');

	useEffect(() => {
		if (id) {
			fetchModel({
				context: 'edit',
				expand: [
					'line_items',
					'line_item.price',
					'price.product',
					'purchases',
					'purchase.product',
					'customer',
				],
			});
		}
	}, [id]);

	return (
		<Template
			status={status}
			pageModelName={'orders'}
			onSubmit={onSubmit}
			onInvalid={onInvalid}
			backUrl={'admin.php?page=ce-orders'}
			backText={__('Back to All Orders', 'checkout_engine')}
			title={
				id
					? __('Edit Order', 'checkout_engine')
					: __('Create Order', 'checkout_engine')
			}
			notices={snackbarNotices}
			removeNotice={removeSnackbarNotice}
			sidebar={<Sidebar />}
		>
			<Fragment>
				<FlashError path="orders" scrollIntoView />
				<Details order={model} loading={isLoading} />
				<LineItems order={model} loading={isLoading} />
				<Charges />
				<Subscriptions />
			</Fragment>
		</Template>
	);
};
