import { createRegistrySelector } from '@wordpress/data';
import { store as coreStore } from '../../store/data';

export const selectProduct = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'products', 0 )
);

export const selectPrices = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'prices' )
);

export const isCreated = createRegistrySelector( ( select ) => () =>
	select( coreStore ).isCreated()
);

/**
 * Get the product status
 */
export const selectProductStatus = createRegistrySelector( ( select ) => () => {
	const product = select( coreStore ).selectModel( 'products' );
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
