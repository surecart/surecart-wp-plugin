// models.js
import { Model, fk, many, attr } from 'redux-orm';
import cuid from 'cuid';

export class Product extends Model {
	static get modelName() {
		return 'Product';
	}
	static get fields() {
		return {
			id: attr( { getDefault: () => cuid() } ),
			name: attr(),
			// prices: many( 'Price' ),
		};
	}
	static reducer( { type, payload }, Product, session ) {
		switch ( type ) {
			case 'CREATE_PRODUCT':
				Product.create( payload );
				break;
			case 'UPDATE_PRODUCT':
				Product.withId( payload.id ).update( payload );
				break;
			case 'REMOVE_PRODUCT':
				Product.withId( payload ).delete();
				break;
			case 'ADD_PRICE_TO_PRODUCT':
				Product.withId( payload.productId ).prices.add(
					action.payload.price
				);
				break;
			case 'REMOVE_PRICE_FROM_PRODUCT':
				Product.withId( action.payload.productId ).authors.remove(
					action.payload.priceId
				);
				break;
		}
		// Return value is ignored.
		return undefined;
	}
}
