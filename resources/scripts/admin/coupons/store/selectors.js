export function getCoupon( state ) {
	return state.promotion?.coupon || {};
}
export function getPromotion( state ) {
	return state.promotion;
}
