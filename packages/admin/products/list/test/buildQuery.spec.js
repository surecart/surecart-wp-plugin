// Run via: `yarn jest --config jest.config.unit.js`.
jest.mock('@wordpress/hooks', () => ({
	applyFilters: (_hook, value) => value,
}));

const {
	buildProductsQuery,
	applyArchiveStatusFilter,
	applyCollectionsFilter,
	applyFeaturedFilter,
	BASE_EXPANDS,
} = require('../buildQuery');

const baseView = {
	perPage: 20,
	page: 1,
	sort: { field: 'created_at', direction: 'desc' },
	search: '',
	filters: [],
	fields: ['name'],
};

describe('buildProductsQuery', () => {
	test('builds default filter args (active products, lean expands)', () => {
		const args = buildProductsQuery(baseView);
		expect(args).toEqual({
			expand_mode: 'replace',
			bundle: false,
			archived: false,
			expand: BASE_EXPANDS,
		});
	});

	test('lean expands stay stable and never include the heavy relations', () => {
		const args = buildProductsQuery(baseView);
		expect(args.expand).toEqual([
			'product_collections',
			'product_medias',
			'product_media.media',
			'variant_options',
		]);
		expect(args.expand).not.toContain('variants');
		expect(args.expand).not.toContain('prices');
	});

	test('commission_structure is added only when the commission column is visible', () => {
		const withColumn = buildProductsQuery({
			...baseView,
			fields: ['name', 'commission_amount'],
		});
		expect(withColumn.expand).toEqual([
			...BASE_EXPANDS,
			'commission_structure',
		]);

		const withoutColumn = buildProductsQuery(baseView);
		expect(withoutColumn.expand).not.toContain('commission_structure');
	});

	test('does not emit pagination/sort/search — those belong to useDataViewState', () => {
		const args = buildProductsQuery({ ...baseView, search: 'shoes' });
		expect(args.per_page).toBeUndefined();
		expect(args.page).toBeUndefined();
		expect(args.sort).toBeUndefined();
		expect(args.query).toBeUndefined();
	});
});

describe('applyArchiveStatusFilter', () => {
	test.each([
		[undefined, false],
		['active', false],
		['archived', true],
	])('value = %s → archived = %s', (value, expected) => {
		const args = {};
		applyArchiveStatusFilter({
			view: value
				? {
						filters: [
							{ field: 'archive_status', operator: 'is', value },
						],
				  }
				: { filters: [] },
			args,
		});
		expect(args.archived).toBe(expected);
	});

	test('value = all leaves archived unset', () => {
		const args = {};
		applyArchiveStatusFilter({
			view: {
				filters: [
					{ field: 'archive_status', operator: 'is', value: 'all' },
				],
			},
			args,
		});
		expect(args.archived).toBeUndefined();
	});
});

describe('applyCollectionsFilter', () => {
	test('isAny → product_collection_ids', () => {
		const args = {};
		applyCollectionsFilter({
			view: {
				filters: [
					{
						field: 'product_collections',
						operator: 'isAny',
						value: ['col_1', 'col_2'],
					},
				],
			},
			args,
		});
		expect(args.product_collection_ids).toEqual(['col_1', 'col_2']);
	});

	test('empty value is a no-op', () => {
		const args = {};
		applyCollectionsFilter({
			view: {
				filters: [
					{
						field: 'product_collections',
						operator: 'isAny',
						value: [],
					},
				],
			},
			args,
		});
		expect(args.product_collection_ids).toBeUndefined();
	});
});

describe('applyFeaturedFilter', () => {
	test.each([
		['true', true],
		['false', false],
	])('value = %s → featured = %s', (value, expected) => {
		const args = {};
		applyFeaturedFilter({
			view: {
				filters: [{ field: 'featured', operator: 'is', value }],
			},
			args,
		});
		expect(args.featured).toBe(expected);
	});

	test('unset filter leaves featured unset', () => {
		const args = {};
		applyFeaturedFilter({ view: { filters: [] }, args });
		expect(args.featured).toBeUndefined();
	});
});

describe('multiple filters compose correctly', () => {
	test('archive + collections coexist', () => {
		const args = buildProductsQuery({
			fields: ['name'],
			filters: [
				{ field: 'archive_status', operator: 'is', value: 'archived' },
				{
					field: 'product_collections',
					operator: 'isAny',
					value: ['col_a'],
				},
			],
		});

		expect(args).toMatchObject({
			archived: true,
			product_collection_ids: ['col_a'],
			expand: BASE_EXPANDS,
		});
	});

	test('archive + featured coexist', () => {
		const args = buildProductsQuery({
			fields: ['name'],
			filters: [
				{ field: 'archive_status', operator: 'is', value: 'active' },
				{ field: 'featured', operator: 'is', value: 'true' },
			],
		});

		expect(args).toMatchObject({
			archived: false,
			featured: true,
			expand: BASE_EXPANDS,
		});
	});
});
