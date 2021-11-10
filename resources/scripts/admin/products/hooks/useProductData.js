import { useSelect, useDispatch } from '@wordpress/data';
import { STORE_KEY } from '../store';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default () => {
	return {
		...useSelect( ( select ) => {
			const prices = select( STORE_KEY ).selectCollection( 'prices' );
			const archivedPrices = prices.filter(
				( price ) => !! price.archived
			);
			const activePrices = prices.filter( ( price ) => ! price.archived );

			let product;
			try {
				product = select( STORE_KEY ).selectProduct();
			} catch ( e ) {
				console.log( e );
			}

			return {
				product,
				error: select( STORE_KEY ).selectError(),
				loading: select( STORE_KEY ).isResolving( 'selectProduct' ),
				isSaving: select( STORE_KEY ).isSaving(),
				status: select( STORE_KEY ).selectProductStatus(),
				isInvalid: select( UI_STORE_KEY ).isInvalid(),
				prices,
				archivedPrices,
				activePrices,
				hasActivePrices: !! activePrices?.length,
				hasArchivedPrices: !! archivedPrices?.length,
			};
		} ),
		...useDispatch( STORE_KEY ),
	};
};
