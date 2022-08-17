import { store } from '../../store/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default {
	*selectOrder() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'orders',
			{
				id,
				expand: [
					'line_items',
					'line_item.price',
					'price.product',
					'purchases',
					'purchase.product',
					'customer',
				],
			}
		);

		// fetch and normalize
		try {
			// we need prices.
			const response = yield apiFetch(request);
			const { customer, line_items, purchases, ...order } = response;
			if (!order?.id) return;
			return yield controls.dispatch(store, 'addModels', {
				orders: [order],
				customers: [customer],
				line_items: line_items?.data || [],
				purchases: purchases?.data || [],
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch(store, 'setError', error);
		}
	},
	*selectCharges() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'charges',
			{
				order_ids: [id],
				expand: [
					'payment_method',
					'payment_method.card',
					'payment_method.payment_instrument',
					'payment_method.paypal_account',
					'payment_method.bank_account',
				],
			}
		);

		// fetch and normalize
		try {
			// we need prices.
			const charges = yield apiFetch(request);
			if (!charges.length) return;
			return yield controls.dispatch(store, 'addModels', {
				charges,
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the charges
			yield controls.dispatch(store, 'setError', error);
		}
	},
	*selectSubscriptions() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'subscriptions',
			{
				order_ids: [id],
				expand: [
					'subscription_items',
					'subscription_items.price',
					'subscription_items.price.product',
				],
			}
		);

		// fetch and normalize
		try {
			const subscriptions = yield apiFetch(request);
			if (!subscriptions.length) return;
			return yield controls.dispatch(store, 'addModels', {
				subscriptions,
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the charges
			yield controls.dispatch(store, 'setError', error);
		}
	},
};
