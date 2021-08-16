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
