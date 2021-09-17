import { __ } from '@wordpress/i18n';
import { controls, dispatch } from '@wordpress/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { getQueryArg } from '@wordpress/url';
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
			const { prices, ...product } = yield apiFetch( {
				path: `products/${ id }`,
			} );
			return yield controls.dispatch( STORE_KEY, 'setEntities', {
				prices: prices.reverse(), // reverse the order
				products: [ product ],
			} );
		} catch ( error ) {
			// add notice error.
			yield controls.dispatch( NOTICES_STORE_KEY, 'addSnackbarNotice', {
				className: 'is-snackbar-error',
				content: __( 'Something went wrong.', 'checkout_engine' ),
			} );
			return yield dispatch( UI_STORE_KEY ).addErrors( [
				{
					index: 0,
					key: 'products',
					error,
				},
			] );
		}
	},
};
