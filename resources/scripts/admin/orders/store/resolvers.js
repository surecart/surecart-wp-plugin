import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { store } from '../../store/data';

export default {
	*selectCheckoutSession() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'checkout_sessions',
			{
				id,
				expand: [
					'line_items',
					'line_item.price',
					'price.product',
					'customer',
				],
			}
		);

		// fetch and normalize
		try {
			// we need prices.
			const response = yield apiFetch( request );
			const { customer, line_items, ...checkout_session } = response;
			if ( ! checkout_session?.id ) return;
			return yield controls.dispatch( store, 'addModels', {
				checkout_sessions: [ checkout_session ],
				customers: [ customer ],
				line_items: line_items?.data || [],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
	*selectCharges() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'charges',
			{
				checkout_session_ids: [ id ],
			}
		);

		// fetch and normalize
		try {
			// we need prices.
			const charges = yield apiFetch( request );
			if ( ! charges.length ) return;
			return yield controls.dispatch( store, 'addModels', {
				charges,
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the charges
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
