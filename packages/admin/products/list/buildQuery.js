// Direct imports (not via the barrel) so unit tests don't transitively load
// the React/`@wordpress/dataviews` modules that would break a node test runner.
import {
	buildQueryFromView,
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

const DEFAULT_HANDLERS = [applyArchiveStatusFilter, applyCollectionsFilter];

const extraArgs = () => ({
	expand: ['product_collections', 'commission_structure'],
});

export const buildProductsQuery = (view) => {
	const filterHandlers = applyFilterHandlerExtensions(
		'products',
		DEFAULT_HANDLERS,
		{ view }
	);
	return buildQueryFromView({
		view,
		defaultSort: DEFAULT_SORT,
		sortMap: SORT_MAP,
		filterHandlers,
		extraArgs,
	});
};

export const PRODUCTS_DEFAULT_SORT = DEFAULT_SORT;
export const PRODUCTS_SORT_MAP = SORT_MAP;
