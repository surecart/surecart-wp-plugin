import { normalize, schema } from 'normalizr';

export { normalize, schema };

export const price = new schema.Entity( 'prices' );
export const product = new schema.Entity( 'products' );
product.define( {
	prices: {
		data: [ price ],
	},
} );
price.define( {
	product,
} );

// normalize price data
export const normalizePrices = ( prices ) => {
	return normalize( { prices }, { prices: [ price ] } );
};

// normalize price data
export const normalizeProducts = ( products ) => {
	return normalize( { products }, { products: [ product ] } );
};

// normalize price data
export const normalizeProduct = ( data ) => {
	return normalize( data, product );
};
