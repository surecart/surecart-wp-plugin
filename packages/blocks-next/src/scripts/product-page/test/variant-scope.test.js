/**
 * Unit tests for the pure variant-selection logic shared by the page product
 * and bundle component pickers.
 */
import {
	getVariantFromValues,
	isProductVariantOptionSoldOut,
	getVariantScope,
	hasEffectiveUnlimitedStock,
	isAnyBundleComponentSoldOut,
} from '../variant-scope';

describe('isAnyBundleComponentSoldOut', () => {
	it('empty or missing components never block', () => {
		expect(isAnyBundleComponentSoldOut(null, null)).toBe(false);
		expect(isAnyBundleComponentSoldOut({}, {})).toBe(false);
	});

	it('unlimited-stock component never blocks', () => {
		const components = {
			c1: { has_unlimited_stock: true, available_stock: 0, variants: [] },
		};
		expect(isAnyBundleComponentSoldOut(components, {})).toBe(false);
	});

	it('non-variant component blocks on zero stock', () => {
		const components = {
			c1: { available_stock: 0, variants: [] },
		};
		expect(isAnyBundleComponentSoldOut(components, {})).toBe(true);
	});

	it('variant component: unselected does not block (incompleteness is gated elsewhere)', () => {
		const components = {
			c1: { variants: [{ id: 'v1', available_stock: 0 }] },
		};
		expect(isAnyBundleComponentSoldOut(components, {})).toBe(false);
	});

	it('variant component: chosen out-of-stock variant blocks', () => {
		const components = {
			c1: {
				variants: [
					{ id: 'v1', available_stock: 0 },
					{ id: 'v2', available_stock: 3 },
				],
			},
		};
		expect(isAnyBundleComponentSoldOut(components, { c1: 'v1' })).toBe(true);
		expect(isAnyBundleComponentSoldOut(components, { c1: 'v2' })).toBe(false);
	});

	it('variant component: a selection with no matching variant blocks instead of silently passing', () => {
		const components = {
			c1: { variants: [{ id: 'v1', available_stock: 5 }] },
		};
		expect(isAnyBundleComponentSoldOut(components, { c1: 'unknown' })).toBe(true);
	});
});

describe('hasEffectiveUnlimitedStock', () => {
	it('uses the variant value when set', () => {
		expect(hasEffectiveUnlimitedStock({ has_unlimited_stock: true }, {})).toBe(true);
		expect(hasEffectiveUnlimitedStock({ has_unlimited_stock: false }, { has_unlimited_stock: true })).toBe(false);
	});

	it('falls back to the product, then to false', () => {
		expect(hasEffectiveUnlimitedStock({}, { has_unlimited_stock: true })).toBe(true);
		expect(hasEffectiveUnlimitedStock({}, {})).toBe(false);
	});
});

describe('getVariantFromValues', () => {
	const variants = [
		{ id: 'v1', option_1: 'Small', option_2: 'Red' },
		{ id: 'v2', option_1: 'Small', option_2: 'Blue' },
		{ id: 'v3', option_1: 'Large', option_2: 'Red' },
	];

	it('matches a full multi-option selection', () => {
		expect(getVariantFromValues({ variants, values: { option_1: 'Small', option_2: 'Blue' } })).toBe(variants[1]);
	});

	it('matches a single-option product', () => {
		const single = [{ id: 'a', option_1: 'Red' }, { id: 'b', option_1: 'Blue' }];
		expect(getVariantFromValues({ variants: single, values: { option_1: 'Blue' } }).id).toBe('b');
	});

	it('returns null when no variant matches', () => {
		expect(getVariantFromValues({ variants, values: { option_1: 'Large', option_2: 'Blue' } })).toBeNull();
	});

	it('returns null when the value count does not match the variant option count', () => {
		expect(getVariantFromValues({ variants, values: { option_1: 'Small' } })).toBeNull();
	});
});

describe('isProductVariantOptionSoldOut', () => {
	it('option 1: in stock is not sold out', () => {
		const variants = [{ option_1: 'Small', available_stock: 3 }];
		expect(isProductVariantOptionSoldOut(1, 'Small', {}, variants, {})).toBe(false);
	});

	it('option 1: all zero stock is sold out', () => {
		const variants = [
			{ option_1: 'Small', available_stock: 0 },
			{ option_1: 'Small', available_stock: 0 },
		];
		expect(isProductVariantOptionSoldOut(1, 'Small', {}, variants, {})).toBe(true);
	});

	it('unlimited stock is never sold out', () => {
		const variants = [{ option_1: 'Small', available_stock: 0, has_unlimited_stock: true }];
		expect(isProductVariantOptionSoldOut(1, 'Small', {}, variants, {})).toBe(false);
	});

	it('constrains by earlier options (option 2)', () => {
		const variants = [
			{ option_1: 'Small', option_2: 'Red', available_stock: 0 },
			{ option_1: 'Large', option_2: 'Red', available_stock: 5 },
		];
		// Red within Small is sold out, but Red within Large is not.
		expect(isProductVariantOptionSoldOut(2, 'Red', { option_1: 'Small' }, variants, {})).toBe(true);
		expect(isProductVariantOptionSoldOut(2, 'Red', { option_1: 'Large' }, variants, {})).toBe(false);
	});

	describe('missingMeansUnavailable (the page vs bundle difference)', () => {
		const variants = [{ option_1: 'Small', available_stock: 5 }];

		it('page scope: a combination with no matching variant stays selectable', () => {
			expect(isProductVariantOptionSoldOut(1, 'XL', {}, variants, {}, false)).toBe(false);
		});

		it('bundle scope: a combination with no matching variant is unavailable', () => {
			expect(isProductVariantOptionSoldOut(1, 'XL', {}, variants, {}, true)).toBe(true);
		});
	});
});

describe('getVariantScope', () => {
	describe('page product scope', () => {
		it('reads the page-level slices and never marks missing as unavailable', () => {
			const ctx = {
				variantValues: { option_1: 'Small' },
				variants: [{ id: 'v1', option_1: 'Small' }],
				product: { id: 'prod_1' },
			};
			const scope = getVariantScope(ctx);
			expect(scope.values).toBe(ctx.variantValues);
			expect(scope.variants).toBe(ctx.variants);
			expect(scope.product).toBe(ctx.product);
			expect(scope.missingMeansUnavailable).toBe(false);
		});

		it('builds an un-namespaced URL key (honouring urlPrefix)', () => {
			expect(getVariantScope({}).urlKey('size')).toBe('size');
			expect(getVariantScope({ urlPrefix: 'p2' }).urlKey('size')).toBe('p2-size');
		});

		it('commit writes the option and dispatches the Stencil sync event', () => {
			const ctx = { product: { id: 'prod_1' }, variantValues: {} };
			const handler = jest.fn();
			document.addEventListener('scVariantValuesUpdated', handler);

			getVariantScope(ctx).commit(1, 'Small');

			expect(ctx.variantValues).toEqual({ option_1: 'Small' });
			expect(handler).toHaveBeenCalledTimes(1);
			expect(handler.mock.calls[0][0].detail).toEqual({
				productId: 'prod_1',
				variantValues: { option_1: 'Small' },
			});
			document.removeEventListener('scVariantValuesUpdated', handler);
		});
	});

	describe('bundle component scope', () => {
		const ctxBase = () => ({
			componentProductId: 'comp_1',
			componentProductSlug: 'tent',
			componentVariants: [
				{ id: 'v1', option_1: 'Red' },
				{ id: 'v2', option_1: 'Blue' },
			],
			componentOptionValues: {},
			bundleComponentVariants: {},
		});

		it('reads the component slices', () => {
			const ctx = ctxBase();
			const scope = getVariantScope(ctx);
			expect(scope.values).toBe(ctx.componentOptionValues);
			expect(scope.variants).toBe(ctx.componentVariants);
			expect(scope.product).toEqual({ has_unlimited_stock: false });
		});

		it('missingMeansUnavailable is the inverse of unlimited stock', () => {
			expect(getVariantScope({ componentProductId: 'c' }).missingMeansUnavailable).toBe(true);
			expect(
				getVariantScope({ componentProductId: 'c', componentHasUnlimitedStock: true }).missingMeansUnavailable
			).toBe(false);
		});

		it('builds a per-component URL key, falling back to id when no slug', () => {
			expect(getVariantScope(ctxBase()).urlKey('color')).toBe('bundle-tent-color');
			expect(
				getVariantScope({ componentProductId: 'comp_1' }).urlKey('color')
			).toBe('bundle-comp_1-color');
		});

		it('commit maps the chosen options to the matching variant id', () => {
			const ctx = ctxBase();
			getVariantScope(ctx).commit(1, 'Blue');
			expect(ctx.componentOptionValues).toEqual({ option_1: 'Blue' });
			expect(ctx.bundleComponentVariants.comp_1).toBe('v2');
		});

		it('commit clears the mapping when the selection matches no variant', () => {
			const ctx = ctxBase();
			ctx.bundleComponentVariants.comp_1 = 'v1';
			getVariantScope(ctx).commit(1, 'Green'); // no such variant
			expect(ctx.bundleComponentVariants.comp_1).toBeUndefined();
		});
	});
});
