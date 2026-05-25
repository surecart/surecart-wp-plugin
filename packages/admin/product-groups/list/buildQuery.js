// Direct imports — see comment in products/list/buildQuery.js.
import {
	buildFilterArgsFromView,
	findFilter,
} from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = {
	name: 'name',
	created: 'created_at',
};

const DEFAULT_SORT = { field: 'created', direction: 'desc' };

// `all` omits the param; matches ProductGroupsListTable::getStatus().
export const applyArchiveStatusFilter = ({ view, args }) => {
	const filter = findFilter(view, 'archive_status');
	const value = filter?.value;
	if (value === 'archived') {
		args.archived = true;
	} else if (!value || value === 'active') {
		args.archived = false;
	}
};

const DEFAULT_HANDLERS = [applyArchiveStatusFilter];

export const buildGroupsQuery = (view) => {
	const filterHandlers = applyFilterHandlerExtensions(
		'product-groups',
		DEFAULT_HANDLERS,
		{ view }
	);
	return buildFilterArgsFromView({
		view,
		filterHandlers,
	});
};

export const GROUPS_DEFAULT_SORT = DEFAULT_SORT;
export const GROUPS_SORT_MAP = SORT_MAP;
