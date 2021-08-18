import * as actions from './actions';
import { fetch as apiFetch } from '../../store/model/controls';
const { getQueryArg } = wp.url;

export default {
	*getPromotion() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch promotion
		const promotion = yield apiFetch( { path: `promotions/${ id }` } );

		return actions.setPromotion( promotion );
	},
};
