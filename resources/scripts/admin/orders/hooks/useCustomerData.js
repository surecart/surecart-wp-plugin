import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				customer: select( store ).selectCustomer(),
				loading: select( store ).isResolving( 'selectCheckoutSession' ),
				error: select( coreStore ).selectError(),
				isSaving: select( coreStore ).isSaving(),
				isInvalid: select( uiStore ).isInvalid(),
			};
		} ),
		...useDispatch( store ),
	};
};
