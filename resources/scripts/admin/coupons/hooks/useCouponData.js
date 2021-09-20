const { useSelect, useDispatch } = wp.data;
import { STORE_KEY } from '../../store/data';

export default () => {
	return {
		...useSelect( ( select ) => {
			return {
				isSaving: select( STORE_KEY ).isSaving(),
				promotion: select( STORE_KEY ).selectPromotion(),
				coupon: select( STORE_KEY ).selectModel( 'coupons', 0 ),
				loading: select( STORE_KEY ).isResolving( 'selectPromotion' ),
			};
		} ),
		...useDispatch( STORE_KEY ),
	};
};
