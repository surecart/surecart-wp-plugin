const { useSelect, useDispatch } = wp.data;
import { STORE_KEY as COUPON_STORE_KEY } from '../store';
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

export default () => {
	const { updateCoupon, updatePromotion, save } = useDispatch(
		COUPON_STORE_KEY
	);
	const {
		promotion,
		coupon,
		loading,
		getValidationErrors,
		isSaving,
	} = useSelect( ( select ) => {
		const { getCoupon, getPromotion, isResolving, isSaving } = select(
			COUPON_STORE_KEY
		);
		const { getValidationErrors } = select( UI_STORE_KEY );

		return {
			isSaving,
			getValidationErrors,
			promotion: getPromotion(),
			coupon: getCoupon(),
			loading: isResolving( 'getPromotion' ),
		};
	} );

	return {
		updateCoupon,
		updatePromotion,
		promotion,
		coupon,
		loading,
		isSaving,
		getValidationErrors,
		saveCoupon: save,
	};
};
