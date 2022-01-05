import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				isCreated: select( store ).isCreated(),
				subscription: select( store ).selectSubscription(),
				loading: select( store ).isResolving( 'selectSubscription' ),
				error: select( coreStore ).selectError(),
				isSaving: select( coreStore ).isSaving(),
				isInvalid: select( uiStore ).isInvalid(),
			};
		} ),
		...useDispatch( store ),
	};
};
