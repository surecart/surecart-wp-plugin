export function getSetting( state, name ) {
	return state.settingsReducer?.name;
}
export function ui( state ) {
	return state.uiReducer;
}
export function notices( state ) {
	return state.uiReducer.notices || [];
}
