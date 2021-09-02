const { useSelect, dispatch } = wp.data;
import { STORE_KEY } from '../store/ui';

export default function useErrors( attribute ) {
	// get errors associated with this attribute.
	const errors = useSelect( ( select ) =>
		attribute ? select( STORE_KEY ).getErrors( attribute ) : []
	);

	return {
		errors,
		hasErrors: errors && !! errors.length,
		clearErrors: () => {
			dispatch( STORE_KEY ).clearErrors( attribute );
		},
	};
}
