import { createRegistrySelector } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store } from './index';

/**
 * Get the coupon
 */
export const selectCoupon = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'coupons', 0 )
);

/**
 * Get the promotion codes for the coupon
 */
export const selectPromotions = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'promotions' )
);

/**
 * Has this been created?
 */
export const isCreated = createRegistrySelector( ( select ) => () =>
	select( coreStore ).isCreated()
);

/**
 * Get the product status
 */
export const selectCouponStatus = createRegistrySelector( ( select ) => () => {
	const product = select( store ).selectCoupon();
	if ( ! product?.id ) {
		return 'draft';
	}
	if ( product?.archived ) {
		return 'archived';
	}
	return 'active';
} );

export const selectError = ( state ) => {
	return state.error;
};

/**
 * Is the model saving?
 */
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
