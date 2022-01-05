import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { store } from '../../store/data';

export default {
	*selectSubscription() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'subscriptions',
			{
				id,
				expand: [
					'checkout_session',
					'checkout_session.line_items',
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
			const response = yield apiFetch( request );
			const {
				customer,
				checkout_session,
				subscription_items,
				...subscription
			} = response;

			if ( ! subscription?.id ) return;

			return yield controls.dispatch( store, 'addModels', {
				subscriptions: [ subscription ],
				customers: [ customer ],
				checkout_sessions: checkout_session?.data || [],
				subscription_items: [
					...( subscription_items?.data
						? subscription_items.data
						: [] ),
				],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
