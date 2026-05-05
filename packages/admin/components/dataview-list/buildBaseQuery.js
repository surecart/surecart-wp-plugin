// Generic view → REST query mapper. Per-screen builders compose this with
// their own filter handlers. Operator → REST mapping:
//   `is` / `isAny`        → inclusion
//   `isNot` / `isNone`    → exclusion
//   `lessThan`/`greaterThan`/`between` → range bounds

export const getStringValues = (value) => {
	if (Array.isArray(value)) {
		return value
			.filter((v) => v !== null && v !== undefined && v !== '')
			.map(String);
	}
	if (value === null || value === undefined || value === '') return [];
	return [String(value)];
};

export const getNumericValues = (value) => {
	const list = Array.isArray(value) ? value : [value];
	return list
		.map((item) => {
			if (typeof item === 'number') return item;
			if (typeof item === 'string' && item.trim() !== '') {
				return Number(item);
			}
			return Number.NaN;
		})
		.filter(Number.isFinite);
};

// Returns a numeric string for range query params, or undefined if the
// input isn't a finite number.
export const getNumericString = (value) => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return String(parsed);
	}
	return undefined;
};

export const isExclusionOperator = (operator) =>
	operator === 'isNot' || operator === 'isNone';

export const isInclusionOperator = (operator) =>
	!operator || operator === 'is' || operator === 'isAny';

export const buildBaseQuery = ({ view, defaultSort, sortMap = {} }) => {
	const sortField = view?.sort?.field
		? sortMap[view.sort.field] || view.sort.field
		: sortMap[defaultSort.field] || defaultSort.field;
	const sortDir = view?.sort?.direction || defaultSort.direction;

	const args = {
		per_page: view?.perPage ?? undefined,
		page: view?.page ?? undefined,
		sort: `${sortField}:${sortDir}`,
	};
	if (view?.search) args.query = view.search;

	return args;
};

export const findFilter = (view, field) =>
	view?.filters?.find((f) => f.field === field);

// Each handler receives `{ view, args }` and either mutates `args` or
// returns a partial object to merge.
export const buildQueryFromView = ({
	view,
	defaultSort,
	sortMap,
	filterHandlers = [],
	extraArgs,
}) => {
	const args = buildBaseQuery({ view, defaultSort, sortMap });

	if (extraArgs) {
		const extra = extraArgs({ view });
		if (extra) Object.assign(args, extra);
	}

	for (const handler of filterHandlers) {
		const partial = handler({ view, args });
		if (partial && typeof partial === 'object') {
			Object.assign(args, partial);
		}
	}

	return args;
};
