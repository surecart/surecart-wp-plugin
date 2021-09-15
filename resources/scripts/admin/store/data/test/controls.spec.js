/**
 * WordPress dependencies
 */
import triggerFetch from '@wordpress/api-fetch';

jest.mock( '@wordpress/api-fetch' );

/**
 * Internal dependencies
 */
import controls from '../controls';

describe( 'controls', () => {
	describe( 'FETCH_FROM_API', () => {
		afterEach( () => {
			triggerFetch.mockClear();
		} );
		it( 'invokes the triggerFetch function', () => {
			controls.FETCH_FROM_API( { options: {} } );
			expect( triggerFetch ).toHaveBeenCalledTimes( 1 );
		} );
		it( 'invokes the triggerFetch with the correct path', () => {
			controls.FETCH_FROM_API( {
				options: { path: 'product', query: { test: 'query' } },
			} );
			expect( triggerFetch ).toHaveBeenCalledWith( {
				path: 'checkout-engine/v1/product?test=query',
			} );
		} );
		it( 'has batch save', () => {
			controls.BATCH_SAVE( {
				batches: [
					{
						key: 'prices',
						request: { path: 'prices' },
						index: 0,
					},
					{
						key: 'prices',
						request: { path: 'prices' },
						index: 1,
					},
				],
			} );
			expect( triggerFetch ).toHaveBeenCalledTimes( 2 );
			expect( triggerFetch ).toHaveBeenCalledWith( {
				path: 'checkout-engine/v1/prices',
			} );
		} );
	} );
} );
