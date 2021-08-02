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

export function save() {
	return {
		type: 'SAVE_COUPON',
	};
}

export function setSaving( value ) {
	return {
		type: 'SET_SAVING',
		value,
	};
}

export function addNotice( notice ) {
	return {
		type: 'SET_NOTICE',
		notice,
	};
}

export function removeNotice( id ) {
	return {
		type: 'REMOVE_NOTICE',
		id,
	};
}

export function fetchFromAPI( path ) {
	return {
		type: 'FETCH_FROM_API',
		path,
	};
}
