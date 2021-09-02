export function isSaving( state ) {
	return state.isSaving;
}
export function flash( state ) {
	return state.flash;
}
export function isInvalid( state ) {
	return state.isInvalid;
}
export function selectErrors( state, model, index = null ) {
	if ( ! model ) {
		return state.errors;
	}

	const filtered = state.errors.filter(
		( error ) => error?.model && error.model === model
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

export function getValidationErrors( state, name = '' ) {
	if ( ! name ) {
		return state.validation;
	}
	const errors = ( state.validation || [] ).filter( ( error ) => {
		return error?.data?.attribute && error?.data?.attribute === name;
	} );
	return errors;
}
