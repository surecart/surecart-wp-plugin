const { useSelect, dispatch } = wp.data;
import { store } from '../store/ui';

export default ( path, index = 0 ) => {
	// get model errors
	const { errors, getValidation } = useSelect( ( select ) => {
		return {
			errors: select( store ).selectErrors( path, index ),
			getValidation: ( key ) =>
				select( store ).selectValidationErrors(
					path,
					index,
					key
				)?.[ 0 ]?.message,
		};
	} );

	return {
		errors,
		getValidation,
		clearErrors: ( index ) => dispatch( store ).clearErrors( index ),
	};
};
