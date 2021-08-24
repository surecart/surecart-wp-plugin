const { useSelect, dispatch } = wp.data;
const { useEffect } = wp.element;
import { STORE_KEY } from '../store/ui';

export default function useValidationErrors( attribute ) {
	// get errors associated with this attribute.
	const errors = useSelect( ( select ) =>
		attribute ? select( STORE_KEY ).getValidationErrors( attribute ) : []
	);

	return {
		errors,
		hasErrors: errors && !! errors.length,
		clearValidation: () => {
			dispatch( STORE_KEY ).clearValidationErrors( attribute );
		},
	};
}
