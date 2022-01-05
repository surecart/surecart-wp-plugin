import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				isCreated: select( store ).isCreated(),
				product: select( store ).selectProduct(),
				loading: select( store ).isResolving( 'selectProduct' ),
				error: select( coreStore ).selectError(),
				isSaving: select( coreStore ).isSaving(),
				status: select( store ).selectProductStatus(),
				isInvalid: select( uiStore ).isInvalid(),
			};
		} ),
		...useSelect( ( select ) => {
			const prices = select( store ).selectPrices();
			const archivedPrices = ( prices || [] ).filter(
				( price ) => !! price.archived
			);
			const activePrices = ( prices || [] ).filter(
				( price ) => ! price.archived
			);
			return {
				prices,
				archivedPrices,
				activePrices,
				hasActivePrices: !! activePrices?.length,
				hasArchivedPrices: !! archivedPrices?.length,
			};
		} ),
		...useDispatch( store ),
	};
};
