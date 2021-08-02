import * as actions from './actions';

export default {
	*getCoupon( id ) {
		const coupon = yield actions.fetchFromAPI( `coupons/${ id }` );
		return actions.updateCoupon( coupon );
	},
};
