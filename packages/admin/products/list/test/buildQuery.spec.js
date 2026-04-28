// Run via: `yarn jest --config jest.config.unit.js`.
jest.mock('@wordpress/hooks', () => ({
	applyFilters: (_hook, value) => value,
}));

const {
	buildProductsQuery,
	applyArchiveStatusFilter,
	applyCollectionsFilter,
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
	test('builds default args (active products, expands relations)', () => {
		const args = buildProductsQuery(baseView);
		expect(args).toMatchObject({
			per_page: 20,
			page: 1,
			sort: 'cataloged_at:desc',
			archived: false,
			expand: ['product_collections', 'commission_structure'],
		});
	});

	test('forwards search as `query`', () => {
		expect(buildProductsQuery({ ...baseView, search: 'shoes' }).query).toBe(
			'shoes'
		);
	});

	test('aliases sort fields per SORT_MAP', () => {
		expect(
			buildProductsQuery({
				...baseView,
				sort: { field: 'name', direction: 'asc' },
			}).sort
		).toBe('name:asc');
		expect(
			buildProductsQuery({
				...baseView,
				sort: { field: 'created_at', direction: 'asc' },
			}).sort
		).toBe('cataloged_at:asc');
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

describe('multiple filters compose correctly', () => {
	test('archive + collections coexist with sort and search', () => {
		const args = buildProductsQuery({
			perPage: 10,
			page: 2,
			sort: { field: 'name', direction: 'asc' },
			search: 'tee',
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
			per_page: 10,
			page: 2,
			sort: 'name:asc',
			query: 'tee',
			archived: true,
			product_collection_ids: ['col_a'],
		});
	});
});
