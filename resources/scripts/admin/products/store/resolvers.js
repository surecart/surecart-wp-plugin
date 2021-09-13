const { controls } = wp.data;
import { fetch as apiFetch } from '../../store/data/controls';
const { getQueryArg } = wp.url;
import { STORE_KEY } from '../../store/data';

export default {
	*selectProduct() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch and normalize
		const { prices, ...product } = yield apiFetch( {
			path: `products/${ id }`,
		} );

		// store.
		return yield controls.dispatch( STORE_KEY, 'setEntities', {
			prices: prices.reverse(), // reverse the order
			product,
		} );
	},
};
