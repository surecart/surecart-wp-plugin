import * as actions from './actions';
import { fetch as apiFetch } from '../../store/data/controls';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
const { getQueryArg } = wp.url;

export default {
	*getPromotion() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch promotion
		try {
			const promotion = yield apiFetch( { path: `promotions/${ id }` } );
		} catch ( e ) {
			dispatch( UI_STORE_KEY ).addErrors( [
				{
					index,
					key,
					index,
					error,
				},
			] );
		}

		return actions.setPromotion( promotion );
	},
};
