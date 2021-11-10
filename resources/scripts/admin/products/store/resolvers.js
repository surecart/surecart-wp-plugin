import { __ } from '@wordpress/i18n';
import { controls, dispatch } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { STORE_KEY } from '../../store/data';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import { STORE_KEY as NOTICES_STORE_KEY } from '../../store/notices';

export default {
	*selectProduct() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch and normalize
		try {
			// we need prices.
			const prices = yield apiFetch( {
				path: addQueryArgs( `prices`, { product_ids: [ id ] } ),
			} );
			if ( ! prices?.length ) return;

			// we need a nested product in the response.
			const product = prices?.[ 0 ].product;
			if ( ! product ) return;

			return yield controls.dispatch( STORE_KEY, 'setEntities', {
				prices: prices.reverse(), // reverse the order
				products: [ product ],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the product.
			yield controls.dispatch( STORE_KEY, 'setError', error );
		}
	},
};
