export function snackbarNotices( state ) {
	return state.snackbar || [];
}
export function isSaving( state ) {
	return state.saving.isSaving;
}
export function flash( state ) {
	return state.errors.flash;
}
export function isInvalid( state ) {
	return state.errors.isInvalid;
}
export function selectErrors( state, key, index = null ) {
	if ( ! key ) {
		return state.errors.errors;
	}

	const filtered = state.errors.errors.filter(
		( error ) => error?.key && error.key === key
	);

	if ( index === null ) {
		return filtered;
	}

	return filtered.filter( ( error ) => error?.index === index );
}

export function selectValidationErrors(
	state,
	key,
	index = null,
	attribute = ''
) {
	const errors = selectErrors( state, key, index );

	let validationErrors = [];

	if ( ! errors.length ) {
		return validationErrors;
	}

	errors.forEach( ( { error } ) => {
		if ( ! error?.additional_errors?.length ) {
			return;
		}
		if ( ! attribute ) {
			validationErrors = [
				...validationErrors,
				...error?.additional_errors,
			];
			return;
		}
		validationErrors = [
			...validationErrors,
			...error?.additional_errors?.filter(
				( error ) => error?.data?.attribute === attribute
			),
		];
	} );

	return validationErrors;
}
