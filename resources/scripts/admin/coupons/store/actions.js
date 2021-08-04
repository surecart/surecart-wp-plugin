export function setCoupon( coupon ) {
	return {
		type: 'SET_MODEL',
		value: coupon,
	};
}

export function updateCoupon( value ) {
	return {
		type: 'UPDATE_MODEL',
		value,
	};
}

export function fetch( path ) {
	return {
		type: 'FETCH_FROM_API',
		path,
	};
}
