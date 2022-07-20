import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
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
import { ScSkeleton } from '@surecart/components-react';
import SaveButton from './components/SaveButton';

export default () => {
	const {
		id,
		order,
		updateOrder,
		saveOrder,
		isLoading,
		error,
		isSaving,
		setSaving,
		fetchOrder,
		getRelation,
	} = useCurrentPage('order');
	const customer = getRelation('customer');
	const charge = getRelation('charge');

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			await saveOrder();
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
			addModelErrors('order', e);
		} finally {
			setSaving(false);
		}
	};

	const onInvalid = () => {
		dispatch(uiStore).setInvalid(true);
	};

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
						'charge.payment_intent',
						'payment_method.card',
						'customer',
						'billing_address',
						'shipping_address',
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
			// button={
			// 	isLoading ? (
			// 		<ScSkeleton
			// 			style={{
			// 				width: '120px',
			// 				height: '35px',
			// 				display: 'inline-block',
			// 			}}
			// 		></ScSkeleton>
			// 	) : (
			// 		<SaveButton isSaving={isSaving}>
			// 			{__('Update Order', 'surecart')}
			// 		</SaveButton>
			// 	)
			// }
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
					updateOrder={updateOrder}
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
