// Run via: `yarn jest --config jest.config.unit.js`.
const {
	default: injectVariantRows,
	isVariantRow,
	isVariantPlaceholder,
	getVariantParent,
	getVariantOriginalId,
	productHasVariantOptions,
	productOnlyItems,
	readVariants,
	VARIANT_PLACEHOLDER,
} = require('../variants/injectVariantRows');

const product = (id, extra = {}) => ({ id, name: `Product ${id}`, ...extra });
const variant = (id, extra = {}) => ({ id, status: 'publish', ...extra });

describe('injectVariantRows (lazy)', () => {
	test('prefers lazily fetched variants over inline product data', () => {
		const p = product('prod_1', { variants: { data: [variant('v_old')] } });
		const rows = injectVariantRows([p], new Set(['prod_1']), {
			variantsByProduct: { prod_1: [variant('v_new')] },
		});

		expect(rows).toHaveLength(2);
		expect(getVariantOriginalId(rows[1])).toBe('v_new');
	});

	test('falls back to inline variants (enveloped and flat) when not in the map', () => {
		const enveloped = product('prod_1', {
			variants: { data: [variant('v_1')] },
		});
		const flat = product('prod_2', { variants: [variant('v_2')] });

		const rows = injectVariantRows(
			[enveloped, flat],
			new Set(['prod_1', 'prod_2']),
			{}
		);

		expect(rows.map((r) => r.id)).toEqual([
			'prod_1',
			'variant:prod_1:v_1',
			'prod_2',
			'variant:prod_2:v_2',
		]);
	});

	test('renders a single loading placeholder row while fetching', () => {
		const p = product('prod_1');
		const rows = injectVariantRows([p], new Set(['prod_1']), {
			loadingIds: new Set(['prod_1']),
		});

		expect(rows).toHaveLength(2);
		expect(isVariantRow(rows[1])).toBe(true);
		expect(isVariantPlaceholder(rows[1])).toBe(true);
		expect(rows[1][VARIANT_PLACEHOLDER]).toBe('loading');
		expect(getVariantParent(rows[1])).toBe(p);
		expect(getVariantOriginalId(rows[1])).toBeNull();
	});

	test('renders an error placeholder row when the fetch failed', () => {
		const p = product('prod_1');
		const rows = injectVariantRows([p], new Set(['prod_1']), {
			failedIds: new Set(['prod_1']),
		});

		expect(rows[1][VARIANT_PLACEHOLDER]).toBe('error');
	});

	test('placeholders are stripped by productOnlyItems like any variant row', () => {
		const p = product('prod_1');
		const rows = injectVariantRows([p], new Set(['prod_1']), {
			loadingIds: new Set(['prod_1']),
		});

		expect(productOnlyItems(rows)).toEqual([p]);
	});

	test('draft and deleted variants stay hidden', () => {
		const p = product('prod_1');
		const rows = injectVariantRows([p], new Set(['prod_1']), {
			variantsByProduct: {
				prod_1: [
					variant('v_live'),
					variant('v_draft', { status: 'draft' }),
					variant('v_gone', { status: 'deleted' }),
				],
			},
		});

		expect(rows).toHaveLength(2);
		expect(getVariantOriginalId(rows[1])).toBe('v_live');
	});

	test('collapsed products gain no extra rows', () => {
		const p = product('prod_1');
		const rows = injectVariantRows([p], new Set(), {
			variantsByProduct: { prod_1: [variant('v_1')] },
		});

		expect(rows).toEqual([p]);
	});
});

describe('productHasVariantOptions', () => {
	test.each([
		['enveloped list shape', { variant_options: { data: [{}] } }, true],
		['flat detail shape', { variant_options: [{}] }, true],
		['empty envelope', { variant_options: { data: [] } }, false],
		['empty flat', { variant_options: [] }, false],
		['null (lean list, no options)', { variant_options: null }, false],
		['missing key', {}, false],
	])('%s → %s', (_label, shape, expected) => {
		expect(productHasVariantOptions(product('prod_1', shape))).toBe(
			expected
		);
	});
});

describe('readVariants', () => {
	test('normalizes enveloped, flat, and absent shapes', () => {
		expect(readVariants({ variants: { data: [variant('v')] } })).toHaveLength(1);
		expect(readVariants({ variants: [variant('v')] })).toHaveLength(1);
		expect(readVariants({ variants: null })).toEqual([]);
		expect(readVariants({})).toEqual([]);
		expect(readVariants(null)).toEqual([]);
	});
});
