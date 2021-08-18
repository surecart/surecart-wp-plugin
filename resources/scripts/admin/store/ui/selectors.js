export function isSaving( state ) {
	return state.isSaving;
}
export function flash( state ) {
	return state.flash;
}
export function getValidationErrors( state, name = '' ) {
	if ( ! name ) {
		return state.validation;
	}

	const errors = ( state.validation || [] ).filter( ( error ) => {
		console.log( error?.data?.attribute, name );
		return error?.data?.attribute && error?.data?.attribute === name;
	} );
	console.log( errors );
	return errors;
}
