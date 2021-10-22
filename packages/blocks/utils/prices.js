/**
 * Convert normalized prices to price choices.
 */
export const convertPricesToChoices = ( prices ) => {
	return Object.keys( prices ).map( ( key ) => {
		return {
			id: prices[ key ]?.id,
			product_id: prices[ key ]?.product,
			quantity: 1,
			enabled: true,
		};
	} );
};

/**
 * Get a unique list of proodut ids from a list of choices.
 */
export const getProductIdsFromChoices = ( prices ) => {
	return [
		...new Set( ( prices || [] ).map( ( price ) => price.product_id ) ),
	];
};
