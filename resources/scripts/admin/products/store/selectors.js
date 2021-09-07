const { createRegistrySelector } = wp.data;
import { selectModel } from '../../store/data/selectors';

/**
 * Get the product
 */
export const selectProduct = ( state ) => {
	return selectModel( state, 'product' );
};

/**
 * Get prices
 */
export const selectPrices = ( state ) => {
	return selectModel( state, 'product.prices' );
};

/**
 * Get a specific price.
 */
export const selectPrice = ( state, index ) => {
	return selectModel( state, `product.prices.${ index }` );
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
