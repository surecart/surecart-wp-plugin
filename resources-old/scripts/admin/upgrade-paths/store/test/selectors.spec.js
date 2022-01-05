/**
 * Internal dependencies
 */
import {
	selectProduct,
	selectProductStatus,
	isSaving as productIsSaving,
} from '../selectors';

describe( 'selectors', () => {
	describe( 'selectProduct', () => {
		it( 'should return product', () => {
			// we will assert the args
			const selectModel = jest.fn( ( args ) => args );
			const hasFinishedResolution = jest.fn( () => true );

			const registry = {
				select: jest.fn( () => ( {
					selectModel,
					hasFinishedResolution,
				} ) ),
			};

			const defaultRegistry = selectProduct.registry;
			selectProduct.registry = registry;
			expect( selectProduct() ).toBe( 'products' );

			selectProduct.registry = defaultRegistry;
		} );
	} );

	describe( 'selectProductStatus', () => {
		it( 'should return draft if not saved', () => {
			// we will assert the args
			const selectModel = jest.fn( () => {} );
			const registry = {
				select: jest.fn( () => ( {
					selectModel,
				} ) ),
			};

			const defaultRegistry = selectProductStatus.registry;
			selectProductStatus.registry = registry;
			expect( selectProductStatus() ).toBe( 'draft' );
			selectProductStatus.registry = defaultRegistry;
		} );

		it( 'should return active if saved', () => {
			// we will assert the args
			const selectModel = jest.fn( () => {
				return { id: 'test' };
			} );
			const registry = {
				select: jest.fn( () => ( {
					selectModel,
				} ) ),
			};

			const defaultRegistry = selectProductStatus.registry;
			selectProductStatus.registry = registry;
			expect( selectProductStatus() ).toBe( 'active' );
			selectProductStatus.registry = defaultRegistry;
		} );

		it( 'should return archived if archived', () => {
			// we will assert the args
			const selectModel = jest.fn( () => {
				return { id: 'test', archived: true };
			} );
			const registry = {
				select: jest.fn( () => ( {
					selectModel,
				} ) ),
			};

			const defaultRegistry = selectProductStatus.registry;
			selectProductStatus.registry = registry;
			expect( selectProductStatus() ).toBe( 'archived' );
			selectProductStatus.registry = defaultRegistry;
		} );
	} );

	describe( 'isSaving', () => {
		it( 'should return is saving', () => {
			// we will assert the args
			const isSaving = jest.fn( () => {
				return true;
			} );
			const registry = {
				select: jest.fn( () => ( {
					isSaving,
				} ) ),
			};

			const defaultRegistry = productIsSaving.registry;
			productIsSaving.registry = registry;
			expect( productIsSaving() ).toBe( true );
			productIsSaving.registry = defaultRegistry;
		} );
	} );
} );
