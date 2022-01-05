import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { store } from '../../store/data';

export default {
	*selectProduct() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'products',
			{ id }
		);

		// fetch and normalize
		try {
			// we need prices.
			const product = yield apiFetch( request );
			if ( ! product?.id ) return;
			return yield controls.dispatch( store, 'addModels', {
				products: [ product ],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
	*selectPrices() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'prices',
			{ product_ids: [ id ] }
		);

		// fetch and normalize
		try {
			// we need prices.
			const prices = yield apiFetch( request );
			if ( ! prices?.length ) return;
			return yield controls.dispatch( store, 'addModels', {
				prices: prices.reverse(), // reverse the order
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
