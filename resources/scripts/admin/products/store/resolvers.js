import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { addQueryArgs } from '@wordpress/url';
import { store } from '../../store/data';

export default {
	*selectProduct() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		// fetch and normalize
		try {
			// we need prices.
			const product = yield apiFetch( {
				path: `products/${ id }`,
			} );
			if ( ! product?.id ) return;

			return yield controls.dispatch( store, 'addEntities', {
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

		// fetch and normalize
		try {
			// we need prices.
			const prices = yield apiFetch( {
				path: addQueryArgs( `prices`, { product_ids: [ id ] } ),
			} );
			if ( ! prices?.length ) return;
			return yield controls.dispatch( store, 'addEntities', {
				prices: prices.reverse(), // reverse the order
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
