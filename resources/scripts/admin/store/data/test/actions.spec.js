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
		const payload = { id: 'test', name: 'test' };
		let fulfillment;
		it( 'should yield the UPDATE_DIRTY action', () => {
			fulfillment = updateModel( 'product', payload );
			// dirty update
			expect( fulfillment.next().value ).toMatchObject(
				controls.dispatch(
					DATA_STORE_KEY,
					'updateDirty',
					'product',
					payload,
					null
				)
			);
		} );

		it( 'should yield the UPDATE_MODEL action', () => {
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
				controls.resolveSelect(
					DATA_STORE_KEY,
					'selectModel',
					key,
					undefined
				)
			);
		} );
	} );

	describe( 'deleteModel', () => {
		let key = 'product';
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

		// TODO: not working.
		it( 'updates main model from api request', () => {
			const { value } = fulfillment.next( product );
			expect( value ).toEqual(
				controls.dispatch(
					DATA_STORE_KEY,
					'updateModel',
					'product',
					product
				)
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

		it( 'clears dirty all posts after saving', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual( {
				type: 'CLEAR_DIRTY',
			} );
		} );

		it( 'adds a snackbar notice', () => {
			const { value } = fulfillment.next();
			expect( value ).toEqual(
				controls.dispatch(
					'checkout-engine/notices',
					'addSnackbarNotice',
					{
						content: 'Saved.',
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
} );
