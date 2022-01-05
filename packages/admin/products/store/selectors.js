import { createRegistrySelector } from '@wordpress/data';
import { store as coreStore } from '../../store/data';
import { store as uiStore } from '../../store/ui';

/**
 * Select the product
 */
export const selectProduct = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectModel( 'products', 0 )
);

/**
 * Select the prices
 */
export const selectPrices = createRegistrySelector( ( select ) => () =>
	select( coreStore ).selectCollection( 'prices' )
);

/**
 * Has the main page object been created?
 */
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
	return select( uiStore ).isSaving();
} );
