import { controls } from '@wordpress/data';

import * as modelActions from '../../store/data/actions';
export * from '../../store/data/actions';
import { STORE_KEY } from '../../store/data';

export function updateModel( key, payload, index ) {
	if ( key === 'coupons' ) {
		// cannot use ad_hoc with recurring.
		if ( payload?.percent_off ) {
			payload.amount_off = null;
		}
		if ( payload?.amount_off ) {
			payload.percent_off = null;
		}
	}
	return modelActions.updateModel( key, payload, index );
}
export function updateCoupon( payload, index = 0 ) {
	return modelActions.updateModel( 'coupons', payload, index );
}
export function updatePromotion( payload, index = 0 ) {
	return modelActions.updateModel( 'promotions', payload, index );
}
