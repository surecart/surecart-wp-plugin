export function setProduct( coupon ) {
	return {
		type: 'SET_MODEL',
		value: coupon,
	};
}

export function updateProduct( value ) {
	return {
		type: 'UPDATE_MODEL',
		value,
	};
}
