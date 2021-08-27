const { __ } = wp.i18n;
const { useSelect, useDispatch } = wp.data;
import { STORE_KEY as PRODUCT_STORE_KEY } from '../store';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default () => {
	const {
		updateProduct,
		updatePrice,
		duplicatePrice,
		deletePrice,
		savePrice,
		addPrice,
		removePrice,
		save,
	} = useDispatch( PRODUCT_STORE_KEY );

	const {
		product,
		prices,
		loading,
		isInvalid,
		getValidationErrors,
		isSaving,
	} = useSelect( ( select ) => {
		const { getProduct, getPrices, isResolving, isSaving } = select(
			PRODUCT_STORE_KEY
		);
		const { getValidationErrors, isInvalid } = select( UI_STORE_KEY );

		return {
			isSaving,
			getValidationErrors,
			isInvalid: isInvalid(),
			prices: getPrices(),
			product: getProduct(),
			loading: isResolving( 'getProduct' ),
		};
	} );

	return {
		updateProduct,
		updatePrice,
		deletePrice,
		duplicatePrice,
		isInvalid,
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
