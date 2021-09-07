import * as actions from './actions';
import { fetch as apiFetch } from '../../store/data/controls';
const { getQueryArg } = wp.url;

export default {
	*selectProduct() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch
		const payload = yield apiFetch( { path: `products/${ id }` } );

		// store.
		return actions.setProduct( payload );
	},
};
