import { getCurrencySymbol } from '../../util';

export function getAccount( state ) {
	return state;
}
export function getCurrency( state ) {
	return state.currency;
}
export function accountCurrencySymbol( state ) {
	return getCurrencySymbol( state.currency );
}
