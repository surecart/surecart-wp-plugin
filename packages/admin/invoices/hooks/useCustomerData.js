import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { useSelect, useDispatch } from '@wordpress/data';

export default () => {
	return {
		...useSelect( ( select ) => {
			const customer = select( store ).selectCustomer();
			return {
				customer,
				loading: select( store ).isResolving( 'selectOrder' ),
				error: select( coreStore ).selectError(),
				editLink: select( coreStore ).getEntityEditLink(
					'customers',
					customer?.id
				),
				isSaving: select( coreStore ).isSaving(),
				isInvalid: select( uiStore ).isInvalid(),
			};
		} ),
		...useDispatch( store ),
	};
};
