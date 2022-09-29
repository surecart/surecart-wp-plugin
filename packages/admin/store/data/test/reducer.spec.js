/**
 * Internal dependencies
 */
import { entities, dirty } from '../reducer';

describe('entities', () => {
	it('can set entities', () => {
		const payload = {
			product: { id: 'product_id', name: 'test' },
			prices: [
				{ id: 'price_id_1', name: 'test' },
				{ id: 'price_id_2', name: 'test' },
			],
		};
		const state = entities(
			{},
			{
				type: 'SET_ENTITIES',
				payload,
			}
		);

		expect(state).toEqual(payload);
	});

	it('can set a model', () => {
		const payload = {
			id: 'price_id_1',
			name: 'test',
		};
		const state = entities(
			{},
			{
				type: 'SET_MODEL',
				key: 'prices.0',
				payload,
			}
		);

		expect(state).toEqual({ prices: { 0: payload } });
	});

	it('can add a model', () => {
		const payload = {
			id: 'price_id_3',
			name: 'test',
		};
		const state = entities(
			{
				product: { id: 'product_id', name: 'test' },
				prices: [
					{ id: 'price_id_1', name: 'test' },
					{ id: 'price_id_2', name: 'test' },
				],
			},
			{
				type: 'ADD_MODEL',
				key: 'prices',
				payload,
			}
		);

		expect(state).toEqual({
			product: { id: 'product_id', name: 'test' },
			prices: [
				{ id: 'price_id_1', name: 'test' },
				{ id: 'price_id_2', name: 'test' },
				{ id: 'price_id_3', name: 'test' },
			],
		});
	});

	it('can add update model', () => {
		const state = entities(
			{
				product: { id: 'product_id', name: 'test' },
				prices: [
					{ id: 'price_id_1', name: 'test' },
					{ id: 'price_id_2', name: 'test' },
				],
			},
			{
				type: 'UPDATE_MODEL',
				key: 'prices.0',
				payload: { name: 'updated' },
			}
		);
		expect(state).toEqual({
			product: { id: 'product_id', name: 'test' },
			prices: [
				{ id: 'price_id_1', name: 'updated' },
				{ id: 'price_id_2', name: 'test' },
			],
		});
	});

	it('can delete a model', () => {
		const state = entities(
			{
				product: { id: 'product_id', name: 'test' },
				prices: [
					{ id: 'price_id_1', name: 'test' },
					{ id: 'price_id_2', name: 'test' },
				],
			},
			{
				type: 'DELETE_MODEL',
				key: 'prices.0',
			}
		);

		expect(state).toEqual({
			product: { id: 'product_id', name: 'test' },
			prices: [{ id: 'price_id_2', name: 'test' }],
		});
	});

	it('can remove a dirty model', () => {
		const state = dirty(
			{
				product_id_2: { name: 'test' },
				price_id_1: { name: 'test' },
				price_id_2: { name: 'test' },
			},
			{
				type: 'REMOVE_DIRTY',
				id: 'price_id_2',
			}
		);

		expect(state).toEqual({
			product_id_2: { name: 'test' },
			price_id_1: { name: 'test' },
		});
	});
});
