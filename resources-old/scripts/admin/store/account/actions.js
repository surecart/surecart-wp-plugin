export function setCurrency( value ) {
	return {
		type: 'SET_CURRENCY',
		value,
	};
}

export function setAccount( value ) {
	return {
		type: 'SET_ACCOUNT',
		value,
	};
}
