/**
 * useDataViewState — View state, query args, and fetch for DataView admin lists.
 *
 * Persists the view (fields, layout, perPage, sort, filters) via
 * @wordpress/preferences under the shared scope `surecart/dataview-lists`.
 * Transient state (page, search) is not persisted.
 */
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

export const PREFERENCES_SCOPE = 'surecart/dataview-lists';
const PERSISTED_VIEW_KEYS = ['fields', 'layout', 'perPage', 'sort', 'filters'];

function readPersistedView(preferenceKey) {
	if (!preferenceKey) return null;
	const stored = select(preferencesStore).get(
		PREFERENCES_SCOPE,
		preferenceKey
	);
	return stored && typeof stored === 'object' ? stored : null;
}

/**
 * @typedef {Object} DataViewStateConfig
 * @property {string}   entity             Entity registered in core-data.
 * @property {string}   [kind]             Defaults to 'surecart'.
 * @property {Object}   [defaultSort]      { field, direction }.
 * @property {Object}   [sortMap]          View field id → API sort name.
 * @property {string[]} [defaultFields]    Initial visible field ids.
 * @property {number}   [perPage]
 * @property {Object}   [layoutStyles]
 * @property {Function} [buildQueryArgs]   Receives { view } — read `view.filters` for faceted filtering.
 * @property {Array}    [initialViewFilters] Seed DataViews `view.filters` (e.g. from URL params).
 * @property {string}   [preferenceKey]    Persistence key under the shared scope.
 */
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
		initialViewFilters = [],
		preferenceKey,
	} = config;

	const { invalidateResolution } = useDispatch(coreStore);
	const { set: setPreference } = useDispatch(preferencesStore);

	// Subscribe to preference so server-loaded values replace defaults on arrival.
	const persistedFromStore = useSelect(
		(sel) =>
			preferenceKey
				? sel(preferencesStore).get(PREFERENCES_SCOPE, preferenceKey)
				: null,
		[preferenceKey]
	);

	const [view, setView] = useState(() =>
		mergeView(
			buildBaseView({ perPage, defaultSort, defaultFields, layoutStyles, initialViewFilters }),
			readPersistedView(preferenceKey),
			{ layoutStyles, initialViewFilters }
		)
	);

	// Apply persisted value once it loads from the server (guard prevents later overwrites).
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current) return;
		if (!persistedFromStore) return;
		setView((prev) =>
			mergeView(prev, persistedFromStore, { layoutStyles, initialViewFilters })
		);
		hydratedRef.current = true;
	}, [persistedFromStore, layoutStyles, initialViewFilters]);

	// Write the persisted subset back whenever view changes.
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

	const invalidateList = useCallback(() => {
		invalidateResolution('getEntityRecords', [kind, entity, queryArgs]);
	}, [invalidateResolution, kind, entity, queryArgs]);

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

function buildBaseView({ perPage, defaultSort, defaultFields, layoutStyles, initialViewFilters }) {
	return {
		type: 'table',
		perPage,
		page: 1,
		sort: defaultSort,
		search: '',
		filters: initialViewFilters,
		fields: defaultFields,
		layout: { styles: layoutStyles },
	};
}

// Merge persisted subset over a base view. Incoming-URL filters and layout.styles
// always override whatever's persisted.
function mergeView(base, persisted, { layoutStyles, initialViewFilters }) {
	if (!persisted) return base;
	const merged = { ...base };
	for (const key of PERSISTED_VIEW_KEYS) {
		if (persisted[key] !== undefined) merged[key] = persisted[key];
	}
	merged.layout = { ...(merged.layout || {}), styles: layoutStyles };
	if (initialViewFilters && initialViewFilters.length) {
		merged.filters = initialViewFilters;
	}
	return merged;
}
