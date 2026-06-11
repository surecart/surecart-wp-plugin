import { isEqual } from 'lodash';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { getQueryArgs } from '@wordpress/url';
import { useHistory, useLocation } from '../../router';

export const PREFERENCES_SCOPE = 'surecart/dataview-lists';

const PERSISTED_VIEW_KEYS = ['fields', 'layout', 'perPage', 'sort'];

// URL keys for pagination state. Reuses WordPress conventions (`paged`, `s`,
// `orderby`, `order`, `per_page`) so deep-linked URLs feel native and survive
const URL_KEY_PAGE = 'paged';
const URL_KEY_PER_PAGE = 'per_page';
const URL_KEY_SORT_FIELD = 'orderby';
const URL_KEY_SORT_DIR = 'order';
const URL_KEY_SEARCH = 's';

const defaultSerialize = (value, multiple) => {
	if (value === null || value === undefined) return undefined;
	if (multiple) {
		const arr = Array.isArray(value) ? value : [value];
		const cleaned = arr.filter(
			(v) => v !== null && v !== undefined && v !== ''
		);
		return cleaned.length ? cleaned.join(',') : undefined;
	}
	return value === '' ? undefined : String(value);
};

const defaultDeserialize = (raw, multiple) => {
	if (raw === undefined || raw === null || raw === '') return undefined;
	if (multiple) return String(raw).split(',').filter(Boolean);
	return raw;
};

const readInitialFiltersFromUrl = (filters = []) => {
	const params = getQueryArgs(window.location.href);
	const out = [];
	for (const cfg of filters) {
		const raw = params[cfg.urlKey];
		const deserialize = cfg.deserialize || defaultDeserialize;
		const fromUrl = deserialize(raw, !!cfg.multiple);
		const value = fromUrl !== undefined ? fromUrl : cfg.defaultValue;
		if (value === undefined) continue;
		out.push({
			field: cfg.field,
			operator: cfg.operator || (cfg.multiple ? 'isAny' : 'is'),
			value,
		});
	}
	return out;
};

// Read pagination/sort/search from the URL on mount so a deep-linked page
// renders the same state on first paint — no flash. Defaults applied here
// match the view defaults so `paged=1`/`order=desc`/etc. needn't be in the URL.
const readInitialPaginationFromUrl = ({ defaultSort, perPage }) => {
	const params = getQueryArgs(window.location.href);

	const rawPage = params[URL_KEY_PAGE];
	const page = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : undefined;

	const rawPerPage = params[URL_KEY_PER_PAGE];
	const perPageFromUrl = rawPerPage
		? Math.max(1, parseInt(rawPerPage, 10) || perPage)
		: undefined;

	const sortField = params[URL_KEY_SORT_FIELD] || undefined;
	const rawDir = params[URL_KEY_SORT_DIR];
	const sortDir = rawDir === 'asc' || rawDir === 'desc' ? rawDir : undefined;
	const sort =
		sortField || sortDir
			? {
					field: sortField || defaultSort.field,
					direction: sortDir || defaultSort.direction,
			  }
			: undefined;

	const search = params[URL_KEY_SEARCH] || undefined;

	return { page, perPage: perPageFromUrl, sort, search };
};

// Stable serialiser used by both the write effect and the back/forward
// compare effect — keeping a single source of truth means we can diff
// "URL we just wrote" against "URL the browser now shows" without divergence.
const serialiseViewToParams = ({
	view,
	pageSlug,
	urlFilters,
	defaultSort,
	defaultPerPage,
}) => {
	const params = { page: pageSlug };

	// Pagination
	if (view.page && view.page !== 1) params[URL_KEY_PAGE] = view.page;
	if (view.perPage && view.perPage !== defaultPerPage) {
		params[URL_KEY_PER_PAGE] = view.perPage;
	}

	// Sort (only when it differs from the screen default)
	if (view.sort?.field && view.sort.field !== defaultSort.field) {
		params[URL_KEY_SORT_FIELD] = view.sort.field;
	}
	if (view.sort?.direction && view.sort.direction !== defaultSort.direction) {
		params[URL_KEY_SORT_DIR] = view.sort.direction;
	}

	// Search
	if (view.search) params[URL_KEY_SEARCH] = view.search;

	// Filters
	for (const cfg of urlFilters) {
		const filter = view.filters?.find((f) => f.field === cfg.field);
		const value = filter?.value;
		const isDefault =
			cfg.defaultValue !== undefined && value === cfg.defaultValue;
		if (value === undefined || isDefault) continue;
		const serialize = cfg.serialize || defaultSerialize;
		const serialised = serialize(value, !!cfg.multiple);
		if (serialised === undefined) continue;
		params[cfg.urlKey] = serialised;
	}

	return params;
};

function readPersistedView(preferenceKey) {
	if (!preferenceKey) return null;
	const stored = select(preferencesStore).get(
		PREFERENCES_SCOPE,
		preferenceKey
	);
	return stored && typeof stored === 'object' ? stored : null;
}

export default function useDataViewState(config) {
	const {
		entity,
		kind = 'surecart',
		defaultSort = { field: 'created_at', direction: 'desc' },
		sortMap = {},
		defaultFields = [],
		perPage = 20,
		layoutStyles = {},
		buildQueryArgs,
		preferenceKey,
		// URL-canonical filter config. When both are provided, the hook
		// seeds filters from the URL on mount and writes them back on view
		// change. Skipped entirely when omitted (e.g. Product Collections).
		pageSlug,
		urlFilters = [],
	} = config;

	const { invalidateResolution } = useDispatch(coreStore);
	const { set: setPreference } = useDispatch(preferencesStore);
	const history = useHistory();
	const location = useLocation();

	// Subscribe to preference so server-loaded values replace defaults on arrival.
	const persistedFromStore = useSelect(
		(sel) =>
			preferenceKey
				? sel(preferencesStore).get(PREFERENCES_SCOPE, preferenceKey)
				: null,
		[preferenceKey]
	);

	// Filters always come from the URL — read once at mount.
	const initialFiltersRef = useRef(null);
	if (initialFiltersRef.current === null) {
		initialFiltersRef.current = readInitialFiltersFromUrl(urlFilters);
	}

	// Same treatment for pagination/sort/search — one-shot read so the first
	// render reflects the URL exactly. Subsequent URL changes are handled by
	// the back/forward sync effect below.
	const initialPaginationRef = useRef(null);
	if (initialPaginationRef.current === null) {
		initialPaginationRef.current = readInitialPaginationFromUrl({
			defaultSort,
			perPage,
		});
	}

	const [view, setView] = useState(() =>
		mergeView(
			buildBaseView({
				perPage,
				defaultSort,
				defaultFields,
				layoutStyles,
				initialFilters: initialFiltersRef.current,
				initialPagination: initialPaginationRef.current,
			}),
			readPersistedView(preferenceKey),
			{ layoutStyles }
		)
	);

	// Apply persisted value once it loads from the server (guard prevents later overwrites).
	// Persisted `page` is intentionally ignored — pagination is URL-driven.
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current) return;
		if (!persistedFromStore) return;
		setView((prev) =>
			mergeView(prev, persistedFromStore, { layoutStyles })
		);
		hydratedRef.current = true;
	}, [persistedFromStore, layoutStyles]);

	// Write the persisted layout subset back when it actually changes. Every
	// preference dispatch makes the persistence layer PUT /wp/v2/users/me, so
	// skipping no-op writes keeps pagination/search/filter changes (and the
	// hydration re-render) off the network.
	const isFirstRenderRef = useRef(true);
	useEffect(() => {
		if (!preferenceKey) return;
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		const subset = {};
		for (const key of PERSISTED_VIEW_KEYS) {
			if (view[key] !== undefined) subset[key] = view[key];
		}
		if (isEqual(readPersistedView(preferenceKey), subset)) return;
		setPreference(PREFERENCES_SCOPE, preferenceKey, subset);
	}, [view, preferenceKey, setPreference]);

	// Mirror view → URL. Use `push` when the page number changes (so the
	// browser Back button steps through pages — the entire point of this
	// feature), and `replace` for every other change to keep the history
	// stack readable. Defaults are stripped so a fresh load has a clean
	// `/admin.php?page=<slug>`.
	const lastWrittenUrlRef = useRef('');
	const lastPageRef = useRef(view.page || 1);
	const isUrlEffectFirstRunRef = useRef(true);
	useEffect(() => {
		if (!pageSlug) return;

		const params = serialiseViewToParams({
			view,
			pageSlug,
			urlFilters,
			defaultSort,
			defaultPerPage: perPage,
		});

		const next = JSON.stringify(params);
		if (next === lastWrittenUrlRef.current) return;
		lastWrittenUrlRef.current = next;

		// First render: never push — that would put an extra entry in
		// history before the user has done anything.
		if (isUrlEffectFirstRunRef.current) {
			isUrlEffectFirstRunRef.current = false;
			lastPageRef.current = view.page || 1;
			history.replace(params);
			return;
		}

		const previousPage = lastPageRef.current;
		const currentPage = view.page || 1;
		lastPageRef.current = currentPage;

		if (currentPage !== previousPage) {
			history.push(params);
		} else {
			history.replace(params);
		}
	}, [view, history, pageSlug, urlFilters, defaultSort, perPage]);

	// Sync URL → view for browser Back/Forward navigation. We compare the
	// serialised URL we last wrote against the current location; if the
	// browser has the URL we wrote, no work. If it's a different URL (user
	// hit Back), rebuild the relevant slice of view from URL state. We don't
	// touch fields/layout — those are personalisation, not URL-bound.
	useEffect(() => {
		if (!pageSlug) return;

		const currentLocationParams = location?.params || {};
		const expectedParams = JSON.parse(lastWrittenUrlRef.current || '{}');

		// Compare just the keys we care about — other params (e.g. action/id
		// from edit navigation) are managed elsewhere and must be left alone.
		const watchedKeys = [
			URL_KEY_PAGE,
			URL_KEY_PER_PAGE,
			URL_KEY_SORT_FIELD,
			URL_KEY_SORT_DIR,
			URL_KEY_SEARCH,
			...urlFilters.map((f) => f.urlKey),
		];
		const matches = watchedKeys.every(
			(k) =>
				(currentLocationParams[k] ?? undefined) ===
				(expectedParams[k] ?? undefined)
		);
		if (matches) return;

		// URL diverged from what we wrote — likely a Back/Forward press.
		// Rebuild the URL-driven slice of state from current location.
		const fromUrl = readInitialPaginationFromUrl({
			defaultSort,
			perPage,
		});
		const filtersFromUrl = readInitialFiltersFromUrl(urlFilters);

		setView((prev) => ({
			...prev,
			page: fromUrl.page ?? 1,
			perPage: fromUrl.perPage ?? perPage,
			sort: fromUrl.sort ?? defaultSort,
			search: fromUrl.search ?? '',
			filters: filtersFromUrl,
		}));

		// Pretend we wrote this URL so the next write effect doesn't ping-pong.
		lastWrittenUrlRef.current = JSON.stringify(
			serialiseViewToParams({
				view: {
					page: fromUrl.page ?? 1,
					perPage: fromUrl.perPage ?? perPage,
					sort: fromUrl.sort ?? defaultSort,
					search: fromUrl.search ?? '',
					filters: filtersFromUrl,
				},
				pageSlug,
				urlFilters,
				defaultSort,
				defaultPerPage: perPage,
			})
		);
		lastPageRef.current = fromUrl.page ?? 1;
	}, [location, pageSlug, urlFilters, defaultSort, perPage]);

	const queryArgs = useMemo(() => {
		const sortField = view.sort?.field
			? sortMap[view.sort.field] || view.sort.field
			: sortMap[defaultSort.field] || defaultSort.field;
		const sortDir = view.sort?.direction || defaultSort.direction;

		const args = {
			per_page: view.perPage,
			page: view.page,
			sort: `${sortField}:${sortDir}`,
		};
		if (view.search) args.query = view.search;
		if (buildQueryArgs) {
			Object.assign(args, buildQueryArgs({ view }));
		}
		return args;
	}, [view, sortMap, defaultSort, buildQueryArgs]);

	const { records, hasResolved, totalItems, totalPages } = useEntityRecords(
		kind,
		entity,
		queryArgs
	);

	// Stale-while-loading: when the query changes (page/sort/search/filter),
	// `useEntityRecords` drops records to empty until the refetch resolves —
	// and DataViews unmounts the bulk-select checkbox column whenever `data`
	// is empty, so the column pops back in on arrival. Keep the last resolved
	// snapshot on screen instead; the layout overlays a spinner meanwhile.
	const staleRef = useRef({
		records: [],
		totalItems: undefined,
		totalPages: undefined,
	});
	let displayRecords = records || [];
	let displayTotalItems = totalItems;
	let displayTotalPages = totalPages;
	if (hasResolved) {
		// Resolved results are authoritative — including an empty set, which
		// must display as empty rather than fall back to stale rows.
		staleRef.current = { records: displayRecords, totalItems, totalPages };
	} else {
		displayRecords = staleRef.current.records;
		displayTotalItems = staleRef.current.totalItems;
		displayTotalPages = staleRef.current.totalPages;
	}

	const paginationInfo = useMemo(
		() => ({
			totalItems: displayTotalItems,
			totalPages: displayTotalPages,
		}),
		[displayTotalItems, displayTotalPages]
	);

	// Keep queryArgs in a ref so invalidateList identity stays stable across
	// sort/filter/page changes — downstream useCallbacks would otherwise rebuild
	// on every view change.
	const queryArgsRef = useRef(queryArgs);
	queryArgsRef.current = queryArgs;
	const invalidateList = useCallback(() => {
		invalidateResolution('getEntityRecords', [
			kind,
			entity,
			queryArgsRef.current,
		]);
	}, [invalidateResolution, kind, entity]);

	return {
		view,
		setView,
		records: displayRecords,
		hasResolved,
		paginationInfo,
		invalidateList,
		queryArgs,
	};
}

function buildBaseView({
	perPage,
	defaultSort,
	defaultFields,
	layoutStyles,
	initialFilters,
	initialPagination,
}) {
	return {
		type: 'table',
		perPage: initialPagination?.perPage ?? perPage,
		page: initialPagination?.page ?? 1,
		sort: initialPagination?.sort ?? defaultSort,
		search: initialPagination?.search ?? '',
		filters: initialFilters,
		fields: defaultFields,
		layout: { styles: layoutStyles },
	};
}

// Merge the persisted layout subset over the base view. `layout.styles`
// always comes from the current spec so column widths can be tuned at
// build time. Persisted `fields` referencing IDs that no longer exist
// are silently ignored by DataViews — no reconciliation needed here.
//
// Persisted `page` is excluded (URL is authoritative for pagination);
// `perPage`/`sort` from prefs are honored only when the URL didn't supply them.
function mergeView(base, persisted, { layoutStyles }) {
	if (!persisted) return base;
	const merged = { ...base };
	for (const key of PERSISTED_VIEW_KEYS) {
		if (persisted[key] === undefined) continue;
		merged[key] = persisted[key];
	}
	merged.layout = { ...(merged.layout || {}), styles: layoutStyles };
	return merged;
}
