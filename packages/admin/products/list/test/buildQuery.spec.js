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
	test('builds default filter args (active products, expands relations)', () => {
		const args = buildProductsQuery(baseView);
		expect(args).toEqual({
			archived: false,
			expand: ['product_collections', 'commission_structure'],
		});
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
			expand: ['product_collections', 'commission_structure'],
		});
	});
});
