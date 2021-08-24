import * as actions from './actions';
import { fetch as apiFetch } from '../../store/model/controls';
const { getQueryArg } = wp.url;

export default {
	*getProduct() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch
		const product = yield apiFetch( { path: `products/${ id }` } );

		return actions.setProduct( product );
	},
};
