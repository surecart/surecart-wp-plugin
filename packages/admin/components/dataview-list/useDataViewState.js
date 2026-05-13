import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { getQueryArgs } from '@wordpress/url';
import { useHistory } from '../../router';

export const PREFERENCES_SCOPE = 'surecart/dataview-lists';

const PERSISTED_VIEW_KEYS = ['fields', 'layout', 'perPage', 'sort'];

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
		const value = deserialize(raw, !!cfg.multiple);
		if (value === undefined) continue;
		out.push({
			field: cfg.field,
			operator: cfg.operator || (cfg.multiple ? 'isAny' : 'is'),
			value,
		});
	}
	return out;
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

	const [view, setView] = useState(() =>
		mergeView(
			buildBaseView({
				perPage,
				defaultSort,
				defaultFields,
				layoutStyles,
				initialFilters: initialFiltersRef.current,
			}),
			readPersistedView(preferenceKey),
			{ layoutStyles }
		)
	);

	// Apply persisted value once it loads from the server (guard prevents later overwrites).
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current) return;
		if (!persistedFromStore) return;
		setView((prev) =>
			mergeView(prev, persistedFromStore, { layoutStyles })
		);
		hydratedRef.current = true;
	}, [persistedFromStore, layoutStyles]);

	// Write the persisted layout subset back whenever view changes.
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
		setPreference(PREFERENCES_SCOPE, preferenceKey, subset);
	}, [view, preferenceKey, setPreference]);

	// Mirror filters back to the URL when they change. Defaults are stripped
	// so a fresh page load has a clean `/admin.php?page=<slug>`.
	const lastWrittenUrlRef = useRef('');
	useEffect(() => {
		if (!pageSlug || !urlFilters.length) return;
		const params = { page: pageSlug };
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
		const next = JSON.stringify(params);
		if (next === lastWrittenUrlRef.current) return;
		lastWrittenUrlRef.current = next;
		history.replace(params);
	}, [view, history, pageSlug, urlFilters]);

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

	const paginationInfo = useMemo(
		() => ({ totalItems, totalPages }),
		[totalItems, totalPages]
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
		records: records || [],
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
}) {
	return {
		type: 'table',
		perPage,
		page: 1,
		sort: defaultSort,
		search: '',
		filters: initialFilters,
		fields: defaultFields,
		layout: { styles: layoutStyles },
	};
}

// Merge the persisted layout subset over the base view. `layout.styles`
// always comes from the current spec so column widths can be tuned at
// build time. Persisted `fields` referencing IDs that no longer exist
// are silently ignored by DataViews — no reconciliation needed here.
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
