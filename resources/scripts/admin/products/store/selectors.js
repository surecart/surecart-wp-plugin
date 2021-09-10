const { createRegistrySelector } = wp.data;
import { selectModel as modelSelector } from '../../store/data/selectors';

export const selectModel = ( state, name ) => {
	return modelSelector( state, name );
};

/**
 * Get the product
 */
export const selectProduct = ( state ) => {
	return modelSelector( state, 'product' );
};

/**
 * Get prices
 */
export const selectPrices = ( state ) => {
	return modelSelector( state, 'prices' );
};

/**
 * Get a specific price.
 */
export const selectPrice = ( state, index ) => {
	return modelSelector( state, `prices.${ index }` );
};

/**
 * Get the product status
 */
export const selectProductStatus = ( state ) => {
	const product = selectProduct( state );
	if ( ! product?.id ) {
		return 'draft';
	}
	if ( product?.archived ) {
		return 'archived';
	}
	return 'active';
};

/**
 * Is the model saving?
 */
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
