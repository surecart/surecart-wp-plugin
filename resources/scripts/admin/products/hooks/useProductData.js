const { useSelect, useDispatch } = wp.data;
import { STORE_KEY as PRODUCT_STORE_KEY } from '../store';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default () => {
	const {
		updateProduct,
		updatePrice,
		addPrice,
		removePrice,
		save,
	} = useDispatch( PRODUCT_STORE_KEY );
	const {
		product,
		prices,
		loading,
		getValidationErrors,
		isSaving,
	} = useSelect( ( select ) => {
		const { getProduct, getPrices, isResolving, isSaving } = select(
			PRODUCT_STORE_KEY
		);
		const { getValidationErrors } = select( UI_STORE_KEY );

		return {
			isSaving,
			getValidationErrors,
			prices: getPrices(),
			product: getProduct(),
			loading: isResolving( 'getProduct' ),
		};
	} );

	return {
		updateProduct,
		updatePrice,
		product,
		addPrice,
		removePrice,
		prices,
		loading,
		isSaving,
		getValidationErrors,
		saveProduct: save,
	};
};
