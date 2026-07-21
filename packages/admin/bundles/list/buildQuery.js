import {
	buildProductsQuery,
	PRODUCTS_DEFAULT_SORT,
	PRODUCTS_SORT_MAP,
} from '../../products/list/buildQuery';

// Bundles are products with `bundle: true`. Reuse the product query (filters,
// search, sort, pagination, collection/featured/archive handlers) verbatim and
// only constrain it to bundles plus the `bundle_items` expand the Items column
// needs. `expand_mode: 'replace'` is inherited from the product query, so this
// appended relation is used as-is by the server.
export const buildBundlesQuery = (view) => {
	const query = buildProductsQuery(view);
	return {
		...query,
		bundle: true,
		expand: [...(query.expand || []), 'bundle_items'],
	};
};

export const BUNDLES_DEFAULT_SORT = PRODUCTS_DEFAULT_SORT;
export const BUNDLES_SORT_MAP = PRODUCTS_SORT_MAP;
