import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { useDispatch, useSelect } from '@wordpress/data';

export default () => {
	return {
		...useSelect((select) => {
			const customer = select(store).selectCustomer();
			const customerId = select(coreStore).selectPageId();
			return {
				isCreated: select(store).isCreated(),
				customerId: customer?.id || customerId,
				customer,
				loading: select(store).isResolving('selectCustomer'),
				error: select(coreStore).selectError(),
				isSaving: select(coreStore).isSaving(),
				isInvalid: select(uiStore).isInvalid(),
			};
		}),
		...useDispatch(store),
	};
};
