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

export function selectPricesByProductId( state, productId ) {
	return Object.fromEntries(
		Object.entries( state?.entities?.prices || {} ).filter(
			( [ _, value ] ) => value.product === productId
		)
	);
}
export function selectPricesByIds( state, priceIds = [] ) {
	return Object.fromEntries(
		Object.entries( state?.entities?.prices || {} ).filter(
			( [ _, value ] ) => {
				return priceIds.includes( value.id );
			}
		)
	);
}
export function selectPricesById( state, id ) {
	return state?.entities?.products?.[ id ];
}
export function selectProductById( state, id ) {
	return state?.entities?.products?.[ id ];
}
export function selectEntityRecord( state, type, id ) {
	return state[ type ][ id ];
}
export function selectAllProducts( state ) {
	return state?.entities?.products || {};
}
export function searchProducts( state, query ) {
	return state?.entities?.products || {};
}
