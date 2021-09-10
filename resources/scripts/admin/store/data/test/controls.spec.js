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
	// create a registry with store to test select controls
	function createSelectTestRegistry() {
		const registry = createRegistry();

		// State is initially null and can receive data.
		// Typical for fetching data from remote locations.
		const reducer = ( state = null, action ) => {
			switch ( action.type ) {
				case 'RECEIVE':
					return action.data;
				default:
					return state;
			}
		};

		// Select state both without and with a resolver
		const selectors = {
			selectorWithoutResolver: ( state ) => state,
			selectorWithResolver: ( state ) => state,
		};

		// The resolver receives data after a little delay
		const resolvers = {
			*selectorWithResolver() {
				yield new Promise( ( r ) => setTimeout( r, 10 ) );
				return { type: 'RECEIVE', data: 'resolved-data' };
			},
		};

		// actions that call the tested controls and return the selected value
		const actions = {
			*resolveWithoutResolver() {
				const value = yield controls.resolveSelect(
					'test/select',
					'selectorWithoutResolver'
				);
				return value;
			},
			*resolveWithResolver() {
				const value = yield controls.resolveSelect(
					'test/select',
					'selectorWithResolver'
				);
				return value;
			},
			*selectWithoutResolver() {
				const value = yield controls.select(
					'test/select',
					'selectorWithoutResolver'
				);
				return value;
			},
			*selectWithResolver() {
				const value = yield controls.select(
					'test/select',
					'selectorWithResolver'
				);
				return value;
			},
		};

		registry.registerStore( 'test/select', {
			reducer,
			actions,
			selectors,
			resolvers,
		} );

		return registry;
	}

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
