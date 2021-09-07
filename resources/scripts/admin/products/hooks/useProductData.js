const { useSelect, useDispatch } = wp.data;
import { STORE_KEY } from '../store';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				product: select( STORE_KEY ).selectProduct(),
				loading: select( STORE_KEY ).isResolving( 'selectProduct' ),
				isSaving: select( STORE_KEY ).isSaving(),
				status: select( STORE_KEY ).selectProductStatus(),
				isInvalid: select( UI_STORE_KEY ).isInvalid(),
				prices: select( STORE_KEY ).selectPrices(),
			};
		} ),
		...useDispatch( STORE_KEY ),
	};
};
