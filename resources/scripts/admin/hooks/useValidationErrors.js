const { useSelect } = wp.data;
import { STORE_KEY } from '../store/ui';

export default ( path, index = 0 ) => {
	// get model errors
	const { errors, getValidation } = useSelect( ( select ) => {
		return {
			errors: select( STORE_KEY ).selectErrors( path, index ),
			getValidation: ( key ) =>
				select( STORE_KEY ).selectValidationErrors(
					path,
					index,
					key
				)?.[ 0 ]?.message,
		};
	} );

	return {
		errors,
		getValidation,
	};
};
