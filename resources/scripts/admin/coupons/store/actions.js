export function setCoupon( coupon ) {
	return {
		type: 'SET_COUPON',
		value: coupon,
	};
}

export function updateCoupon( value ) {
	return {
		type: 'UPDATE_COUPON',
		value,
	};
}

export function setPromotions( promotion ) {
	return {
		type: 'SET_PROMOTIONS',
		value: promotion,
	};
}

export function updatePromotion( item ) {
	return {
		type: 'UPDATE_PROMOTION',
		item,
	};
}

export function fetch( path, query ) {
	return {
		type: 'FETCH_FROM_API',
		path,
		query,
	};
}
