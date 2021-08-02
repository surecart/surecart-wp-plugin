export function getCoupon( state ) {
	return state.couponReducer;
}
export function ui( state ) {
	return state.uiReducer;
}
export function notices( state ) {
	return state.uiReducer.notices || [];
}
