import * as actions from './actions';
import { fetch as apiFetch } from './controls';
const { getQueryArg } = wp.url;

export default {
	*selectModel( name ) {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		if ( name !== 'product' ) {
			return;
		}

		// fetch
		const product = yield apiFetch( { path: `${ name }s/${ id }` } );

		return actions.setModel( name, product );
	},
};
