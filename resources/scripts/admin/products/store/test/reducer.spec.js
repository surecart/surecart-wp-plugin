/**
 * Internal dependencies
 */
import { entities } from '../reducer';

describe( 'entities', () => {
	it( 'should have initial price state', () => {
		expect( entities( undefined, {} ) ).toEqual( {
			prices: [
				{
					object: 'price',
					name: 'Default',
					recurring_interval: 'year',
					recurring_interval_count: 1,
				},
			],
		} );
	} );
	it( 'should update product_id in prices when product id is updated', () => {
		expect(
			entities( undefined, {
				type: 'UPDATE_MODEL',
				key: 'product',
				payload: {
					id: 'test_id',
				},
			} )
		).toEqual( {
			prices: [
				{
					object: 'price',
					name: 'Default',
					recurring_interval: 'year',
					recurring_interval_count: 1,
					product_id: 'test_id',
				},
			],
			product: {
				id: 'test_id',
			},
		} );
	} );
} );
