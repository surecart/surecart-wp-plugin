// No built-in filters yet; the function exists so plugins have a defined hook
// (`surecart.dataview.product-collections.filterHandlers`) to register into.
// Direct imports — see comment in products/list/buildQuery.js.
import { buildQueryFromView } from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = {
	name: 'name',
	created: 'created_at',
	products_count: 'products_count',
};

const DEFAULT_SORT = { field: 'created', direction: 'desc' };

const DEFAULT_HANDLERS = [];

export const buildCollectionsQuery = (view) => {
	const filterHandlers = applyFilterHandlerExtensions(
		'product-collections',
		DEFAULT_HANDLERS,
		{ view }
	);
	return buildQueryFromView({
		view,
		defaultSort: DEFAULT_SORT,
		sortMap: SORT_MAP,
		filterHandlers,
	});
};

export const COLLECTIONS_DEFAULT_SORT = DEFAULT_SORT;
export const COLLECTIONS_SORT_MAP = SORT_MAP;
