import { store } from '../../store/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default {
	*selectCustomer() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'customers',
			{ id, expand: ['billing_address', 'shipping_address'] }
		);

		// fetch and normalize
		try {
			// we need prices.
			const customer = yield apiFetch(request);
			if (!customer?.id) return;
			return yield controls.dispatch(store, 'addModels', {
				customers: [customer],
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the model.
			yield controls.dispatch(store, 'setError', error);
		}
	},
	*selectOrders() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'orders',
			{
				customer_ids: [id],
				status: ['paid'],
				expand: ['payment_method', 'line_items'],
			}
		);

		// fetch and normalize
		try {
			const orders = yield apiFetch(request);
			if (!orders?.length) return;
			return yield controls.dispatch(store, 'addModels', {
				orders: orders.reverse(), // reverse the order
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the model.
			yield controls.dispatch(store, 'setError', error);
		}
	},
};
