const { createRegistrySelector } = wp.data;

export const getProduct = ( state ) => {
	return state.product;
};
export const getPrices = ( state ) => {
	return state.prices;
};
export const getPrice = ( state, index ) => {
	return state.prices?.[ index ];
};
export const getUnsavedPrice = ( state, index ) => {
	return state?.lastSavedPrices?.[ index ];
};
export const getVariations = ( state ) => {
	return ( state.prices || [] ).slice( 1 );
};
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
