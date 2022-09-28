import { store } from '../../store/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default {
	*selectSubscription() {
		// maybe get from url.
		const id = yield controls.resolveSelect(store, 'selectPageId');
		if (!id) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'subscriptions',
			{
				id,
				expand: [
					'order',
					'order.line_items',
					'line_item.price',
					'subscription_items',
					'subscription_item.price',
					'price.product',
					'customer',
				],
			}
		);

		// fetch and normalize
		try {
			// we need prices.
			const response = yield apiFetch(request);
			const { customer, order, subscription_items, ...subscription } =
				response;

			if (!subscription?.id) return;

			return yield controls.dispatch(store, 'addModels', {
				subscriptions: [subscription],
				customers: [customer],
				orders: order?.data || [],
				subscription_items: [
					...(subscription_items?.data
						? subscription_items.data
						: []),
				],
			});
		} catch (error) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch(store, 'setError', error);
		}
	},
};
