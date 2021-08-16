export function setPromotion( value ) {
	return {
		type: 'SET_PROMOTION',
		value,
	};
}

export function updatePromotion( value ) {
	return {
		type: 'UPDATE_PROMOTION',
		value,
	};
}

export function setCoupon( value ) {
	return ( dispatch ) => {
		dispatch( {
			type: 'SET_COUPON',
			value,
		} );
	};
}

export function updateCoupon( value ) {
	return {
		type: 'UPDATE_COUPON',
		value,
	};
}

export function fetch( path, query ) {
	return {
		type: 'FETCH_FROM_API',
		path,
		query,
	};
}
