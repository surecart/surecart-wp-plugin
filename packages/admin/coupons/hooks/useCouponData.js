import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';
import { store } from '../store';

export default () => {
	return {
		...useSelect((select) => {
			return {
				isCreated: select(store).isCreated(),
				coupon: select(store).selectCoupon(),
				loading: select(store).isResolving('selectCoupon'),
				error: select(coreStore).selectError(),
				isSaving: select(coreStore).isSaving(),
				status: select(store).selectCouponStatus(),
				isInvalid: select(uiStore).isInvalid(),
			};
		}),
		...useDispatch(store),
	};
};
