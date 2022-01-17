import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';
import { useSelect, useDispatch } from '@wordpress/data';

export default () => {
	return {
		...useSelect((select) => {
			const pageId = select(coreStore).selectPageId();
			const order = select(store).selectOrder();
			return {
				isCreated: select(store).isCreated(),
				order,
				orderId: order?.id || pageId,
				loading: select(store).isResolving('selectOrder'),
				error: select(coreStore).selectError(),
				isSaving: select(coreStore).isSaving(),
				isInvalid: select(uiStore).isInvalid(),
			};
		}),
		...useDispatch(store),
	};
};
