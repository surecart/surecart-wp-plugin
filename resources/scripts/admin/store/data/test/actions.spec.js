/**
 * WordPress dependencies
 */
import triggerFetch from '@wordpress/api-fetch';
import { controls } from '@wordpress/data';
import { STORE_KEY as DATA_STORE_KEY } from '../index';
import { STORE_KEY as UI_STORE_KEY } from '../../ui';
import { fetch as apiFetch } from '../controls';

import * as actions from '../actions';

const {
	setEntities,
	setModel,
	addModel,
	updateModel,
	updateDirty,
	deleteModel,
	saveModel,
} = actions;

jest.mock( '@wordpress/api-fetch' );

describe( 'actions', () => {
	afterEach( () => {
		triggerFetch.mockClear();
	} );

	describe( 'setEntities', () => {
		it( 'should return the SET_ENTITIES action', () => {
			const entities = [];
			const result = setEntities( entities );
			expect( result ).toEqual( {
				type: 'SET_ENTITIES',
				payload: entities,
			} );
		} );
	} );

	describe( 'setModel', () => {
		it( 'should return the SET_MODEL action', () => {
			const payload = { id: 'test' };
			const result = setModel( 'product', payload );
			expect( result ).toEqual( {
				key: 'product',
				type: 'SET_MODEL',
				payload,
			} );
		} );
		it( 'should return the SET_MODEL action with index', () => {
			const payload = { id: 'test' };
			const result = setModel( 'product', payload, 5 );
			expect( result ).toEqual( {
				key: 'product.5',
				type: 'SET_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'addModel', () => {
		it( 'should return the ADD_MODEL action', () => {
			const payload = { id: 'test' };
			const result = addModel( 'product', payload );
			expect( result ).toEqual( {
				key: 'product',
				type: 'ADD_MODEL',
				payload,
			} );
		} );
		it( 'should return the ADD_MODEL action with index', () => {
			const payload = { id: 'test' };
			const result = addModel( 'product', payload, 5 );
			expect( result ).toEqual( {
				key: 'product.5',
				type: 'ADD_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'updateModel', () => {
		it( 'should yield the UPDATE_MODEL action', () => {
			const payload = { id: 'test', name: 'test' };
			const fulfillment = updateModel( 'product', payload );
			// dirty update
			expect( fulfillment.next().value ).toMatchObject( {} );
			// update model
			expect( fulfillment.next().value ).toEqual( {
				key: 'product',
				type: 'UPDATE_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'updateDirty', () => {
		it( 'should yield the UPDATE_DIRTY action', () => {
			const payload = { id: 'test', name: 'test' };
			const key = 'product';

			const fulfillment = updateDirty( key, payload );
			// dirty should first selectModel
			expect( fulfillment.next().value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectModel', key )
			);
		} );
	} );

	describe( 'deleteModel', () => {
		it( 'should yield the DELETE_MODEL action', () => {
			const key = 'product';
			const fulfillment = deleteModel( key );
			// should first selectModel
			expect( fulfillment.next().value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectModel', key )
			);
			expect( fulfillment.next().value ).toEqual( {
				key,
				type: 'DELETE_MODEL',
			} );
		} );
	} );

	describe( 'saveModel', () => {
		let fulfillment;
		const product = { id: 'testmodel', content: 'foo' };
		const allModels = {
			product,
			prices: [
				{ id: 'cleanprice', name: 'clean', object: 'price' },
				{ id: 'dirtyprice', name: 'dirty', object: 'price' },
			],
		};
		const dirty = {
			[ product?.id ]: product,
			dirtyprice: allModels.prices[ 1 ],
		};

		const reset = () =>
			( fulfillment = saveModel( 'product', { with: [ 'prices' ] } ) );

		it( 'clears errors', () => {
			reset();
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch( UI_STORE_KEY, 'clearErrors' )
			);
		} );

		it( 'sets saving', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch( UI_STORE_KEY, 'setSaving', true )
			);
		} );

		it( 'gets dirty models', () => {
			let { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectDirty' )
			);
		} );

		it( 'selects all models', () => {
			let { value } = fulfillment.next( dirty );
			expect( value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectAllModels' )
			);
		} );

		// gets fresh model
		it( 'selects model', () => {
			let { value } = fulfillment.next( allModels );
			expect( value ).toEqual(
				controls.resolveSelect(
					DATA_STORE_KEY,
					'selectModel',
					'product'
				)
			);
		} );

		it( 'yields expected action for the api fetch call', () => {
			const { value } = fulfillment.next( product );
			expect( value ).toEqual( {
				type: 'FETCH_FROM_API',
				options: {
					data: product,
					method: 'PATCH',
					path: `products/${ product.id }`,
				},
			} );
		} );

		it( 'yields expected action for batch api calls', () => {
			const { value } = fulfillment.next( allModels );
			expect( value ).toEqual( {
				type: 'BATCH_SAVE',
				batches: [
					{
						index: 1,
						key: 'prices',
						request: {
							data: {
								id: 'dirtyprice',
								name: 'dirty',
								object: 'price',
							},
							method: 'PATCH',
							path: 'checkout-engine/v1/prices/dirtyprice',
						},
					},
				],
			} );
		} );
	} );
} );
