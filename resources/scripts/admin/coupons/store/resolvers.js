import * as actions from './actions';
const { getQueryArg } = wp.url;

export default {
	*getCoupon( id = 0 ) {
		if ( ! id ) {
			id = getQueryArg( window.location, 'id' );
		}
		const coupon = yield actions.fetch( `coupons/${ id }` );
		return actions.updateCoupon( coupon );
	},
	*getPromotions( query ) {
		const promotion = yield actions.fetch( 'promotions', query );
		return actions.setPromotions( promotion );
	},
};
