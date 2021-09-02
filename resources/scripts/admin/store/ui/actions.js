export function setSaving( value ) {
	return {
		type: 'SET_SAVING',
		value,
	};
}

export function setInvalid( value ) {
	return {
		type: 'SET_INVALID',
		value,
	};
}

export function setFlash( value ) {
	return {
		type: 'SET_FLASH',
		value,
	};
}

export function addErrors( value ) {
	return {
		type: 'ADD_ERRORS',
		value,
	};
}
export function clearErrors( index = null ) {
	return {
		type: 'CLEAR_ERRORS',
		index,
	};
}

export function addValidationErrors( value ) {
	return {
		type: 'ADD_VALIDATION_ERRORS',
		value,
	};
}

export function clearValidationErrors( attribute = '' ) {
	return {
		type: 'CLEAR_VALIDATION_ERRORS',
		attribute,
	};
}
