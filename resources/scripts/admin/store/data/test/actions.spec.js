/**
 * WordPress dependencies
 */
import triggerFetch from '@wordpress/api-fetch';
import { controls } from '@wordpress/data';
import { STORE_KEY as DATA_STORE_KEY } from '../index';
import { STORE_KEY as UI_STORE_KEY } from '../../ui';
import { STORE_KEY as NOTICES_STORE_KEY } from '../../notices';

import * as actions from '../actions';

const {
	setEntities,
	setModel,
	addModel,
	updateModel,
	updateDirty,
	deleteModel,
	saveModel,
	removeDirty,
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
			const result = setModel( 'products', payload );
			expect( result ).toEqual( {
				key: 'products.0',
				type: 'SET_MODEL',
				payload,
			} );
		} );
		it( 'should return the SET_MODEL action with index', () => {
			const payload = { id: 'test' };
			const result = setModel( 'products', payload, 5 );
			expect( result ).toEqual( {
				key: 'products.5',
				type: 'SET_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'addModel', () => {
		it( 'should return the ADD_MODEL action', () => {
			const payload = { id: 'test' };
			const result = addModel( 'products', payload );
			expect( result ).toEqual( {
				key: 'products',
				type: 'ADD_MODEL',
				payload,
			} );
		} );
		it( 'should return the ADD_MODEL action with index', () => {
			const payload = { id: 'test' };
			const result = addModel( 'products', payload );
			expect( result ).toEqual( {
				key: 'products',
				type: 'ADD_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'updateModel', () => {
		const payload = { id: 'test', name: 'test' };
		let fulfillment;
		it( 'should yield the UPDATE_DIRTY action', () => {
			fulfillment = updateModel( 'products', payload );
			// dirty update
			expect( fulfillment.next().value ).toMatchObject(
				controls.dispatch(
					DATA_STORE_KEY,
					'updateDirty',
					'products',
					payload,
					0
				)
			);
		} );

		it( 'should yield the UPDATE_MODEL action', () => {
			// update model
			expect( fulfillment.next().value ).toEqual( {
				key: 'products.0',
				type: 'UPDATE_MODEL',
				payload,
			} );
		} );
	} );

	describe( 'updateDirty', () => {
		it( 'should yield the UPDATE_DIRTY action', () => {
			const payload = { id: 'test', name: 'test' };
			const key = 'products';

			const fulfillment = updateDirty( key, payload );
			// dirty should first selectModel
			expect( fulfillment.next().value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectModel', key, 0 )
			);
		} );
	} );

	describe( 'deleteModel', () => {
		let key = 'products';
		let fulfillment;
		it( 'should yield the SELECT_MODEL action', () => {
			fulfillment = deleteModel( key, 1 );
			const { value } = fulfillment.next();
			// should first selectModel
			expect( value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectModel', key, 1 )
			);
		} );

		it( 'should set saving to true', () => {
			const { value } = fulfillment.next( {
				id: 'asdf',
				object: 'price',
			} );
			expect( value ).toEqual(
				controls.dispatch( UI_STORE_KEY, 'setSaving', true )
			);
		} );

		it( 'should delete the model on the server', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual( {
				type: 'FETCH_FROM_API',
				options: {
					method: 'DELETE',
					path: `prices/asdf`,
				},
			} );
		} );

		it( 'should set saving to false', () => {
			const { value } = fulfillment.next( {
				id: 'asdf',
				object: 'price',
			} );
			expect( value ).toEqual(
				controls.dispatch( UI_STORE_KEY, 'setSaving', false )
			);
		} );

		it( 'should show a notice', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch( NOTICES_STORE_KEY, 'addSnackbarNotice', {
					content: 'Deleted.',
				} )
			);
		} );

		it( 'should yield the DELETE_MODEL action', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual( {
				key: `${ key }.1`,
				type: 'DELETE_MODEL',
			} );
		} );

		it( 'should be complete', () => {
			const { done } = fulfillment.next();
			expect( done ).toBeTruthy();
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
			( fulfillment = saveModel( 'products', { with: [ 'prices' ] } ) );

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
			let { value } = fulfillment.next( dirty );
			expect( value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectDirty' )
			);
		} );

		// gets fresh model
		it( 'selects model', () => {
			let { value } = fulfillment.next( dirty );
			expect( value ).toEqual(
				controls.resolveSelect(
					DATA_STORE_KEY,
					'selectModel',
					'products',
					0
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

		it( 'updates main model from api request', () => {
			const { value } = fulfillment.next( product );
			expect( value ).toEqual(
				controls.dispatch(
					DATA_STORE_KEY,
					'updateModel',
					'products',
					product,
					0
				)
			);
		} );

		it( 'removes the dirty record', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch( DATA_STORE_KEY, 'removeDirty', product.id )
			);
		} );

		it( 'selects all models', () => {
			let { value } = fulfillment.next( product );
			expect( value ).toEqual(
				controls.resolveSelect( DATA_STORE_KEY, 'selectAllModels' )
			);
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
							path: 'prices/dirtyprice',
						},
					},
				],
			} );
		} );

		it( 'adds a snackbar notice', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch(
					'checkout-engine/notices',
					'addSnackbarNotice',
					{
						content: 'Updated.',
					}
				)
			);
		} );

		it( 'sets saving to false', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch( UI_STORE_KEY, 'setSaving', false )
			);
		} );

		it( 'finishes', () => {
			const { done } = fulfillment.next();
			expect( done ).toBeTruthy();
		} );
	} );

	describe( 'removeDirty', () => {
		let fulfillment;
		it( 'selects the model in the state', () => {
			fulfillment = removeDirty( 'prices', 2 );
			const { value } = fulfillment.next();
			expect( value ).toMatchObject(
				controls.resolveSelect(
					DATA_STORE_KEY,
					'selectModel',
					'prices',
					2
				)
			);
		} );
		it( 'Yields the CLEAR_DIRTY_MODEL action', () => {
			const { value } = fulfillment.next( { id: 'asdf' } );
			expect( value ).toMatchObject( {
				type: 'REMOVE_DIRTY',
				id: 'asdf',
			} );
		} );
	} );
} );
