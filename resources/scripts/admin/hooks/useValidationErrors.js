const { useSelect } = wp.data;
import { STORE_KEY } from '../store/ui';

export default function useValidationErrors( attribute ) {
	const errors = useSelect( ( select ) =>
		select( STORE_KEY ).getValidationErrors( attribute )
	);
	return {
		errors,
		hasErrors: errors && !! errors.length,
	};
}
