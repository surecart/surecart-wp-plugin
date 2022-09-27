import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';

export default () => {
	return {
		...useSelect((select) => {
			const promotions = select(store).selectPromotions();
			const archivedPromotions = (promotions || []).filter(
				(promotion) => !!promotion.archived
			);
			const activePromotions = (promotions || []).filter(
				(promotion) => !promotion.archived
			);

			return {
				isCreated: select(store).isCreated(),
				promotions,
				archivedPromotions,
				activePromotions,
				hasActivePromotions: !!activePromotions?.length,
				hasArchivedPromotions: !!archivedPromotions?.length,
				loading: select(store).isResolving('selectPromotions'),
				error: select(coreStore).selectError(),
				isSaving: select(coreStore).isSaving(),
				isInvalid: select(uiStore).isInvalid(),
			};
		}),
		...useDispatch(store),
	};
};
