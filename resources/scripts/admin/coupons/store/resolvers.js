import * as actions from './actions';
const { getQueryArg } = wp.url;

export default {
	*getPromotion() {
		// maybe get from url.
		const id = getQueryArg( window.location, 'id' );
		if ( ! id ) return {};

		// fetch promotion
		const promotion = yield actions.fetch( `promotions/${ id }` );

		return actions.setPromotion( promotion );
	},
};
