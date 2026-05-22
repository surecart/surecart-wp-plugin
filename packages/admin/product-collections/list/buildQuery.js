// Direct imports — see comment in products/list/buildQuery.js.
import {
	buildQueryFromView,
	getStringValues,
	findFilter,
} from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = {
	name: 'name',
	created: 'created_at',
	products_count: 'products_count',
};

const DEFAULT_SORT = { field: 'created', direction: 'desc' };

// Products picker → REST `product_ids`; field id is the visible column's.
export const applyProductsFilter = ({ view, args }) => {
	const filter = findFilter(view, 'products_count');
	if (!filter) return;
	const values = getStringValues(filter.value);
	if (!values.length) return;
	args.product_ids = values;
};

const DEFAULT_HANDLERS = [applyProductsFilter];

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
