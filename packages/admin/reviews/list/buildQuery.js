import {
	buildFilterArgsFromView,
	getStringValues,
	findFilter,
} from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = {
	stars: 'stars',
	created: 'created_at',
};

const DEFAULT_SORT = { field: 'created', direction: 'desc' };

// Status arrives at the platform as `status[]` — the REST controller renames
// the key. `all` clears the filter.
export const applyStatusFilter = ({ view, args }) => {
	const filter = findFilter(view, 'status');
	const value = filter?.value;
	if (!value || value === 'all') return;
	args.status = [value];
};

export const applyProductFilter = ({ view, args }) => {
	const filter = findFilter(view, 'product');
	if (!filter) return;
	const values = getStringValues(filter.value);
	if (!values.length) return;
	args.product_ids = values;
};

// Stars — controller renames to `stars[]` for the platform.
export const applyStarsFilter = ({ view, args }) => {
	const filter = findFilter(view, 'stars');
	if (!filter) return;
	const values = getStringValues(filter.value);
	if (!values.length) return;
	args.stars = values;
};

const DEFAULT_HANDLERS = [
	applyStatusFilter,
	applyProductFilter,
	applyStarsFilter,
];

const extraArgs = () => ({
	expand: ['customer', 'product'],
});

export const buildReviewsQuery = (view) => {
	const filterHandlers = applyFilterHandlerExtensions(
		'reviews',
		DEFAULT_HANDLERS,
		{ view }
	);
	return buildFilterArgsFromView({
		view,
		filterHandlers,
		extraArgs,
	});
};

export const REVIEWS_DEFAULT_SORT = DEFAULT_SORT;
export const REVIEWS_SORT_MAP = SORT_MAP;
