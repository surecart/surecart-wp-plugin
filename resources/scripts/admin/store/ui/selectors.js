export function isSaving( state ) {
	return state.isSaving;
}
export function flash( state ) {
	return state.flash;
}
export function isInvalid( state ) {
	return state.isInvalid;
}
export function selectErrors( state, key, index = null ) {
	if ( ! key ) {
		return state.errors;
	}

	const filtered = state.errors.filter(
		( error ) => error?.key && error.key === key
	);

	if ( index === null ) {
		return filtered;
	}

	return filtered.filter( ( error ) => error?.index === index );
}

export function selectValidationErrors( state, model, index, attribute = '' ) {
	const errors = selectErrors( state, model, index );

	if ( ! errors?.additional_errors?.length ) {
		return [];
	}

	if ( ! attribute ) {
		return errors?.additional_errors;
	}

	return errors?.additional_errors?.filter(
		( error ) => error?.data?.attribute === attribute
	);
}
