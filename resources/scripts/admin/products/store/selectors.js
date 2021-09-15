import { createRegistrySelector } from '@wordpress/data';
import { STORE_KEY } from './index';

export const selectProduct = createRegistrySelector( ( select ) => () =>
	select( STORE_KEY ).selectModel( 'products', 0 )
);

/**
 * Get the product status
 */
export const selectProductStatus = createRegistrySelector( ( select ) => () => {
	const product = select( STORE_KEY ).selectModel( 'products' );
	if ( ! product?.id ) {
		return 'draft';
	}
	if ( product?.archived ) {
		return 'archived';
	}
	return 'active';
} );

/**
 * Is the model saving?
 */
export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( 'checkout-engine/ui' ).isSaving();
} );
