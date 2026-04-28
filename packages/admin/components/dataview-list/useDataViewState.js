import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

export const PREFERENCES_SCOPE = 'surecart/dataview-lists';

const PERSISTED_VIEW_KEYS = [
	'type',
	'fields',
	'layout',
	'perPage',
	'page',
	'sort',
	'search',
	'filters',
];

// Stored alongside the persisted view so we can invalidate the user's
// saved `fields` when the screen's default columns change.
const FIELDS_VERSION_KEY = '_fieldsVersion';

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
		// Bump this when `defaultFields` changes so users with persisted
		// preferences pick up the new default columns instead of being
		// stuck on whatever they had saved.
		defaultFieldsVersion,
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
			buildBaseView({
				perPage,
				defaultSort,
				defaultFields,
				layoutStyles,
				initialViewFilters,
			}),
			readPersistedView(preferenceKey),
			{
				layoutStyles,
				initialViewFilters,
				defaultFields,
				defaultFieldsVersion,
			}
		)
	);

	// Apply persisted value once it loads from the server (guard prevents later overwrites).
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current) return;
		if (!persistedFromStore) return;
		setView((prev) =>
			mergeView(prev, persistedFromStore, {
				layoutStyles,
				initialViewFilters,
				defaultFields,
				defaultFieldsVersion,
			})
		);
		hydratedRef.current = true;
	}, [
		persistedFromStore,
		layoutStyles,
		initialViewFilters,
		defaultFields,
		defaultFieldsVersion,
	]);

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
		if (defaultFieldsVersion) {
			subset[FIELDS_VERSION_KEY] = defaultFieldsVersion;
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
	initialViewFilters,
}) {
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

// Merge persisted subset over a base view. Incoming-URL filters and
// layout.styles always override whatever's persisted. If the persisted
// `_fieldsVersion` doesn't match the current `defaultFieldsVersion`, the
// persisted `fields` are dropped so users pick up new default columns.
function mergeView(
	base,
	persisted,
	{ layoutStyles, initialViewFilters, defaultFields, defaultFieldsVersion }
) {
	if (!persisted) return base;
	const merged = { ...base };
	const fieldsVersionMismatch =
		defaultFieldsVersion !== undefined &&
		persisted[FIELDS_VERSION_KEY] !== defaultFieldsVersion;
	for (const key of PERSISTED_VIEW_KEYS) {
		if (persisted[key] === undefined) continue;
		// Skip persisted `fields` when the default-columns version has
		// changed — fall back to the current defaults instead.
		if (key === 'fields' && fieldsVersionMismatch) continue;
		merged[key] = persisted[key];
	}
	if (fieldsVersionMismatch) {
		merged.fields = defaultFields;
	}
	merged.layout = { ...(merged.layout || {}), styles: layoutStyles };
	if (initialViewFilters && initialViewFilters.length) {
		merged.filters = initialViewFilters;
	}
	return merged;
}
