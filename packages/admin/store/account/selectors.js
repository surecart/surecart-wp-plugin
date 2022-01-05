import { getCurrencySymbol } from '../../util';

export function getAccount( state ) {
	return state;
}
export function getCurrency( state ) {
	return state.currency;
}
export function getSupportedCurrencies( state ) {
	return state.supported_currencies;
}
export function accountCurrencySymbol( state ) {
	return getCurrencySymbol( state.currency );
}
