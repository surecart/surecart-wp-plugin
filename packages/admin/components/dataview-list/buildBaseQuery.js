/**
 * Generic view → REST query mapper for SureCart dataview lists.
 *
 * A pure function that turns a DataViews `view` shape into the REST query
 * args our `index` controllers expect (`per_page`, `page`, `sort`, `query`,
 * plus per-screen filter fields). Per-screen builders compose this base:
 * they add their own filter handlers, expansions, and sort overrides on top.
 *
 * Operator semantics follow @wordpress/dataviews:
 *   - `is`, `isAny`             → inclusion
 *   - `isNot`, `isNone`         → exclusion
 *   - `lessThan` / `greaterThan` → upper / lower bound
 *   - `between`                 → array of [min, max]
 *
 * @typedef {Object} View
 * @property {number}   [perPage]
 * @property {number}   [page]
 * @property {string}   [search]
 * @property {{field: string, direction: 'asc'|'desc'}} [sort]
 * @property {Array<{field:string, operator:string, value:*}>} [filters]
 */

/**
 * Coerce a DataViews filter value to an array of strings.
 *
 * @param {*} value
 * @returns {string[]}
 */
export const getStringValues = (value) => {
	if (Array.isArray(value)) {
		return value
			.filter((v) => v !== null && v !== undefined && v !== '')
			.map(String);
	}
	if (value === null || value === undefined || value === '') return [];
	return [String(value)];
};

/**
 * Coerce a DataViews filter value to an array of finite numbers.
 *
 * @param {*} value
 * @returns {number[]}
 */
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

/**
 * Coerce a DataViews filter value to a single numeric query string, or
 * undefined if the value isn't a finite number. Used for range filters.
 *
 * @param {*} value
 * @returns {string|undefined}
 */
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

/**
 * Treat the operator as exclusion (isNot / isNone).
 *
 * @param {string} operator
 * @returns {boolean}
 */
export const isExclusionOperator = (operator) =>
	operator === 'isNot' || operator === 'isNone';

/**
 * Treat the operator as inclusion (is / isAny).
 *
 * @param {string} operator
 * @returns {boolean}
 */
export const isInclusionOperator = (operator) =>
	!operator || operator === 'is' || operator === 'isAny';

/**
 * Build the base query args (pagination, sort, search) from a view.
 *
 * @param {Object}                         options
 * @param {View}                           options.view
 * @param {{field:string, direction:string}} options.defaultSort
 * @param {Object<string,string>}           [options.sortMap]
 * @returns {Object}
 */
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

/**
 * Find the first filter for a field id, or undefined.
 *
 * @param {View}   view
 * @param {string} field
 * @returns {Object|undefined}
 */
export const findFilter = (view, field) =>
	view?.filters?.find((f) => f.field === field);

/**
 * Build the final query by merging base args with per-screen filter handlers.
 *
 * Each handler receives `{ view, args }` and mutates `args` in place (or
 * returns a partial to merge). Handlers that early-return on missing values
 * are encouraged.
 *
 * @param {Object}   options
 * @param {View}     options.view
 * @param {Object}   options.defaultSort
 * @param {Object}   [options.sortMap]
 * @param {Function[]} [options.filterHandlers]
 * @param {Function}   [options.extraArgs] - returns extra base args, e.g. `expand`
 * @returns {Object}
 */
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
