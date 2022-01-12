import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { useSelect, useDispatch } from '@wordpress/data';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				isCreated: select( store ).isCreated(),
				customer: select( store ).selectCustomer(),
				loading: select( store ).isResolving( 'selectCustomer' ),
				error: select( coreStore ).selectError(),
				isSaving: select( coreStore ).isSaving(),
				isInvalid: select( uiStore ).isInvalid(),
			};
		} ),
		...useDispatch( store ),
	};
};
