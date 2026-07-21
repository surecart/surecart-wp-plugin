import {
	buildFilterArgsFromView,
	getStringValues,
	findFilter,
} from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = {
	name: 'name',
	created_at: 'cataloged_at',
};

const DEFAULT_SORT = { field: 'created_at', direction: 'desc' };

// Three-way switch: `active` → `archived=false`, `archived` → `archived=true`,
// `all` → omit the param.
export const applyArchiveStatusFilter = ({ view, args }) => {
	const filter = findFilter(view, 'archive_status');
	const value = filter?.value;
	if (value === 'archived') {
		args.archived = true;
	} else if (!value || value === 'active') {
		args.archived = false;
	}
};

export const applyCollectionsFilter = ({ view, args }) => {
	const filter = findFilter(view, 'product_collections');
	if (!filter) return;
	const values = getStringValues(filter.value);
	if (!values.length) return;
	args.product_collection_ids = values;
};

export const applyFeaturedFilter = ({ view, args }) => {
	const filter = findFilter(view, 'featured');
	const value = filter?.value;
	if (value === 'true') {
		args.featured = true;
	} else if (value === 'false') {
		args.featured = false;
	}
};

const DEFAULT_HANDLERS = [
	applyArchiveStatusFilter,
	applyCollectionsFilter,
	applyFeaturedFilter,
];

// Lean list expands — paired with `expand_mode: 'replace'` below, the
// middleware uses this set verbatim instead of the forced edit defaults.
// Price renders from base-object `metrics`; variants load lazily on row
// expand; `variant_options` is only fetched to know the expander exists.
export const BASE_EXPANDS = [
	'product_collections',
	'product_medias',
	'product_media.media',
	'variant_options',
];

const buildProductsExpand = (view) => {
	const expand = [...BASE_EXPANDS];
	if (view?.fields?.includes('commission_amount')) {
		expand.push('commission_structure');
	}
	return expand;
};

export const buildProductsQuery = (view) => {
	const filterHandlers = applyFilterHandlerExtensions(
		'products',
		DEFAULT_HANDLERS,
		{ view }
	);
	// Expand first so filter-handler extensions can override it for custom
	// columns that need extra relations. `expand_mode: 'replace'` opts this
	// list out of the server's forced edit expands so the set above is used
	// verbatim; extensions that add relations augment it additively.
	return {
		expand_mode: 'replace',
		bundle: false,
		expand: buildProductsExpand(view),
		...buildFilterArgsFromView({
			view,
			filterHandlers,
		}),
	};
};

export const PRODUCTS_DEFAULT_SORT = DEFAULT_SORT;
export const PRODUCTS_SORT_MAP = SORT_MAP;
