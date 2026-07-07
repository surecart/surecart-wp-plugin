/**
 * Unit tests for the generic dataview query helpers.
 */
const {
	getStringValues,
	getNumericValues,
	getNumericString,
	isExclusionOperator,
	isInclusionOperator,
	buildBaseQuery,
	buildQueryFromView,
	findFilter,
} = require('../buildBaseQuery');

describe('getStringValues', () => {
	test('coerces an array of mixed primitives to strings', () => {
		expect(getStringValues([1, 'two', 3])).toEqual(['1', 'two', '3']);
	});
	test('drops null/undefined/empty', () => {
		expect(getStringValues([null, undefined, '', 'x'])).toEqual(['x']);
	});
	test('wraps a single primitive', () => {
		expect(getStringValues('foo')).toEqual(['foo']);
		expect(getStringValues(42)).toEqual(['42']);
	});
	test('returns empty for nullish/empty', () => {
		expect(getStringValues(null)).toEqual([]);
		expect(getStringValues('')).toEqual([]);
	});
});

describe('getNumericValues', () => {
	test('coerces numeric arrays', () => {
		expect(getNumericValues([1, '2', 3])).toEqual([1, 2, 3]);
	});
	test('drops non-finite values', () => {
		expect(getNumericValues(['abc', NaN, '3'])).toEqual([3]);
	});
});

describe('getNumericString', () => {
	test('returns string for finite number', () => {
		expect(getNumericString(42)).toBe('42');
	});
	test('parses numeric strings', () => {
		expect(getNumericString('  100 ')).toBe('100');
	});
	test('rejects non-numeric strings', () => {
		expect(getNumericString('abc')).toBeUndefined();
	});
	test('rejects empty/null', () => {
		expect(getNumericString('')).toBeUndefined();
		expect(getNumericString(null)).toBeUndefined();
	});
});

describe('operator helpers', () => {
	test('isExclusionOperator covers isNot and isNone', () => {
		expect(isExclusionOperator('isNot')).toBe(true);
		expect(isExclusionOperator('isNone')).toBe(true);
		expect(isExclusionOperator('is')).toBe(false);
		expect(isExclusionOperator('isAny')).toBe(false);
	});
	test('isInclusionOperator covers is/isAny/falsy', () => {
		expect(isInclusionOperator('is')).toBe(true);
		expect(isInclusionOperator('isAny')).toBe(true);
		expect(isInclusionOperator(undefined)).toBe(true);
		expect(isInclusionOperator('isNone')).toBe(false);
	});
});

describe('buildBaseQuery', () => {
	test('builds pagination + sort + search', () => {
		const args = buildBaseQuery({
			view: {
				perPage: 25,
				page: 3,
				sort: { field: 'cataloged_at', direction: 'asc' },
				search: 'foo',
			},
			defaultSort: { field: 'cataloged_at', direction: 'desc' },
		});
		expect(args.per_page).toBe(25);
		expect(args.page).toBe(3);
		expect(args.sort).toBe('cataloged_at:asc');
		expect(args.query).toBe('foo');
	});

	test('uses defaultSort when view has no sort', () => {
		const args = buildBaseQuery({
			view: { perPage: 10, page: 1 },
			defaultSort: { field: 'created_at', direction: 'desc' },
		});
		expect(args.sort).toBe('created_at:desc');
	});

	test('applies sortMap aliasing', () => {
		const args = buildBaseQuery({
			view: { sort: { field: 'created_at', direction: 'desc' } },
			defaultSort: { field: 'created_at', direction: 'desc' },
			sortMap: { created_at: 'cataloged_at' },
		});
		expect(args.sort).toBe('cataloged_at:desc');
	});

	test('omits search when blank', () => {
		const args = buildBaseQuery({
			view: { search: '' },
			defaultSort: { field: 'a', direction: 'asc' },
		});
		expect(args.query).toBeUndefined();
	});
});

describe('buildQueryFromView', () => {
	test('runs all handlers and merges into args', () => {
		const args = buildQueryFromView({
			view: { filters: [{ field: 'foo', operator: 'is', value: 'bar' }] },
			defaultSort: { field: 'created', direction: 'desc' },
			filterHandlers: [
				({ view, args }) => {
					const filter = view.filters[0];
					if (filter.value === 'bar') args.foo = 'BAR';
				},
				() => ({ extra: true }),
			],
			extraArgs: () => ({ expand: ['relations'] }),
		});
		expect(args.foo).toBe('BAR');
		expect(args.extra).toBe(true);
		expect(args.expand).toEqual(['relations']);
	});
});

describe('findFilter', () => {
	test('returns the first matching filter or undefined', () => {
		const view = {
			filters: [
				{ field: 'a', value: 1 },
				{ field: 'b', value: 2 },
			],
		};
		expect(findFilter(view, 'b').value).toBe(2);
		expect(findFilter(view, 'missing')).toBeUndefined();
	});

	test('handles missing filters array', () => {
		expect(findFilter({}, 'a')).toBeUndefined();
	});
});
