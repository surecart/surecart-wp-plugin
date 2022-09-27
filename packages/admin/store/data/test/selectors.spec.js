/**
 * Internal dependencies
 */
import { selectAllModels, selectModel, selectDirty } from '../selectors';

describe('selectors', () => {
	describe('selectAllModels', () => {
		it('should return all models', () => {
			const state = {
				entities: {
					product: { id: 'product_id', name: 'test' },
					prices: [
						{ id: 'price_id_1', name: 'test' },
						{ id: 'price_id_2', name: 'test' },
					],
				},
			};
			expect(selectAllModels(state)).toEqual(state.entities);
		});
	});
	describe('selectModel', () => {
		it('should return a model', () => {
			const state = {
				entities: {
					products: [{ id: 'product_id', name: 'test' }],
					prices: [
						{ id: 'price_id_1', name: 'test' },
						{ id: 'price_id_2', name: 'test' },
					],
				},
			};
			expect(selectModel(state, 'prices')).toEqual(
				state.entities.prices[0]
			);
			expect(selectModel(state, 'prices', 2)).toEqual(undefined);
			expect(selectModel(state, 'products')).toEqual(
				state.entities.products[0]
			);
		});

		describe('selectDirty', () => {
			const state = {
				dirty: {
					dirty_1: { id: 'product_id_1', name: 'test' },
					dirty_2: { id: 'product_id_2', name: 'test' },
				},
			};
			expect(selectDirty(state)).toEqual(state.dirty);
		});
	});
});
