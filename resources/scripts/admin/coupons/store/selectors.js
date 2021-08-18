const { createRegistrySelector } = wp.data;

export const getCoupon = ( state ) => {
	return state.coupon;
};
export const getPromotion = ( state ) => {
	return state.promotion;
};
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
