import { normalizePrices, normalizeProducts } from '../index';
describe('Schema', () => {
	describe('normalizePrices', () => {
		it('Normalizes prices with product', () => {
			expect(
				normalizePrices([
					{
						id: 'price',
						product: {
							id: 'product',
						},
					},
				]).entities
			).toEqual({
				prices: {
					price: {
						id: 'price',
						product: 'product',
					},
				},
				products: {
					product: {
						id: 'product',
					},
				},
			});
		});
	});
	describe('normalizeProducts', () => {
		it('Normalizes products with prices', () => {
			expect(
				normalizeProducts([
					{
						id: 'product',
						prices: {
							data: [
								{
									id: 'price_1',
								},
								{
									id: 'price_2',
								},
							],
						},
					},
				]).entities
			).toEqual({
				prices: {
					price_1: {
						id: 'price_1',
					},
					price_2: {
						id: 'price_2',
					},
				},
				products: {
					product: {
						id: 'product',
						prices: {
							data: ['price_1', 'price_2'],
						},
					},
				},
			});
		});
	});
});
