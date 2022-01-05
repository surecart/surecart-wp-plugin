import { __ } from '@wordpress/i18n';
import { controls } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { store } from '../../store/data';

export default {
	*selectCoupon() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'coupons',
			{ id }
		);

		// fetch and normalize
		try {
			// we need prices.
			const coupon = yield apiFetch( request );
			if ( ! coupon?.id ) return;
			return yield controls.dispatch( store, 'addModels', {
				coupons: [ coupon ],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the model.
			yield controls.dispatch( store, 'setError', error );
		}
	},
	*selectPromotions() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'promotions',
			{ coupon_ids: [ id ] }
		);

		// fetch and normalize
		try {
			// we need prices.
			const promotions = yield apiFetch( request );
			if ( ! promotions?.length ) return;
			return yield controls.dispatch( store, 'addModels', {
				promotions: promotions.reverse(), // reverse the order
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
