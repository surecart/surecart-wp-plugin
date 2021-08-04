export function getCoupon( state ) {
	return state.model;
}
export function ui( state ) {
	return state.ui;
}
export function notices( state ) {
	return state.ui.notices || [];
}
