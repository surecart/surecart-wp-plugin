/**
 * useDataViewState — Manages DataView view state, query arg building, and data fetching
 * for SureCart admin list pages.
 *
 * @example
 * const { view, setView, records, hasResolved, paginationInfo, status, setStatus } = useDataViewState({
 *   entity: 'product',
 *   defaultSort: { field: 'date', direction: 'desc' },
 *   sortMap: { name: 'name', date: 'cataloged_at' },
 *   defaultFields: ['name', 'price', 'date'],
 *   persistKey: 'surecart/products-list-view/v1',
 *   buildQueryArgs: ({ view, status, filters }) => {
 *     const args = {};
 *     if (status === 'active') args.archived = false;
 *     if (filters.collectionId) args.product_collection_ids = [filters.collectionId];
 *     return args;
 *   },
 * });
 */
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { getQueryArgs } from '@wordpress/url';

/**
 * Keys of the view state we persist to localStorage.
 *
 * We deliberately skip `page` and `search` because they represent transient
 * interaction state — reloading a page shouldn't remember that the user was
 * mid-search on page 7. Everything else (visible columns, column widths,
 * per-page, sort, filters) is considered part of the user's view preference.
 */
const PERSISTED_VIEW_KEYS = [
	'fields',
	'layout',
	'perPage',
	'sort',
	'filters',
];

/**
 * Safely read a persisted view snapshot from localStorage.
 *
 * @param {string|undefined} key Storage key.
 * @return {Object|null} Parsed snapshot or null.
 */
function readPersistedView( key ) {
	if ( ! key || typeof window === 'undefined' || ! window.localStorage ) {
		return null;
	}
	try {
		const raw = window.localStorage.getItem( key );
		if ( ! raw ) return null;
		const parsed = JSON.parse( raw );
		return parsed && typeof parsed === 'object' ? parsed : null;
	} catch ( err ) {
		return null;
	}
}

/**
 * Write a whitelisted subset of view state to localStorage.
 *
 * @param {string|undefined} key  Storage key.
 * @param {Object}           view Full view object.
 */
function writePersistedView( key, view ) {
	if ( ! key || typeof window === 'undefined' || ! window.localStorage ) {
		return;
	}
	try {
		const subset = {};
		for ( const field of PERSISTED_VIEW_KEYS ) {
			if ( view[ field ] !== undefined ) {
				subset[ field ] = view[ field ];
			}
		}
		window.localStorage.setItem( key, JSON.stringify( subset ) );
	} catch ( err ) {
		// Quota exceeded / SecurityError — silently ignore. The in-memory
		// view state still works, we just won't rehydrate on next load.
	}
}

/**
 * @typedef {Object} DataViewStateConfig
 * @property {string}   entity          - Entity name registered in core-data (e.g. 'product').
 * @property {string}   [kind]          - Entity kind. Defaults to 'surecart'.
 * @property {Object}   [defaultSort]   - Initial sort. Defaults to { field: 'date', direction: 'desc' }.
 * @property {Object}   [sortMap]       - Map of view field IDs to API sort field names.
 * @property {string[]} [defaultFields] - Initial visible field IDs.
 * @property {number}   [perPage]       - Items per page. Defaults to 20.
 * @property {string}   [defaultStatus] - Default tab status. Defaults to 'active'.
 * @property {Object}   [layoutStyles]  - Column width overrides via DataViews layout.styles API.
 * @property {Function} [buildQueryArgs]- Additional query args from custom state. Receives { view, status, filters }.
 */

/**
 * Hook: useDataViewState
 *
 * @param {DataViewStateConfig} config
 */
export default function useDataViewState( config ) {
	const {
		entity,
		kind = 'surecart',
		defaultSort = { field: 'date', direction: 'desc' },
		sortMap = {},
		defaultFields = [],
		perPage = 20,
		defaultStatus = 'active',
		layoutStyles = {},
		buildQueryArgs,
		initialFilters = {},
		initialViewFilters = [],
		persistKey,
	} = config;

	// Status tab state.
	const [ status, setStatus ] = useState( defaultStatus );

	// Custom filter state (entity-specific filters like collectionId).
	// Seed with initialFilters from config (e.g. from URL query params).
	const [ filters, setFilters ] = useState( initialFilters );

	const { invalidateResolution } = useDispatch( coreStore );

	// Build the initial view. Precedence (highest wins): URL-derived
	// `initialViewFilters` > persisted state > defaults. URL params winning
	// last ensures deep-links (e.g. ?sc_collection=xxx) always reflect the
	// requested filter even when the user has a different saved view.
	const [ view, setView ] = useState( () => {
		const baseView = {
			type: 'table',
			perPage,
			page: 1,
			sort: defaultSort,
			search: '',
			filters: initialViewFilters,
			fields: defaultFields,
			layout: {
				styles: layoutStyles,
			},
		};

		const persisted = readPersistedView( persistKey );
		if ( ! persisted ) {
			return baseView;
		}

		// Merge persisted state on top of defaults — but always force
		// URL-derived filters to take precedence if they exist.
		const merged = { ...baseView };
		for ( const field of PERSISTED_VIEW_KEYS ) {
			if ( persisted[ field ] !== undefined ) {
				merged[ field ] = persisted[ field ];
			}
		}
		// Layout.styles is always sourced from config — it holds the
		// component's render-time width hints, not user-editable state.
		merged.layout = {
			...( merged.layout || {} ),
			styles: layoutStyles,
		};
		if ( initialViewFilters && initialViewFilters.length ) {
			merged.filters = initialViewFilters;
		}
		return merged;
	} );

	// Persist a whitelisted subset of the view on every change.
	// Using a ref to avoid writing on the very first render when state
	// matches what we just rehydrated from storage.
	const isFirstRenderRef = useRef( true );
	useEffect( () => {
		if ( ! persistKey ) return;
		if ( isFirstRenderRef.current ) {
			isFirstRenderRef.current = false;
			return;
		}
		writePersistedView( persistKey, view );
	}, [ view, persistKey ] );

	/**
	 * Update a custom filter value and reset to page 1.
	 */
	const setFilter = useCallback( ( key, value ) => {
		setFilters( ( prev ) => ( { ...prev, [ key ]: value } ) );
		setView( ( prev ) => ( { ...prev, page: 1 } ) );
	}, [] );

	/**
	 * Change status tab and reset to page 1.
	 */
	const changeStatus = useCallback( ( newStatus ) => {
		setStatus( newStatus );
		setView( ( prev ) => ( { ...prev, page: 1 } ) );
	}, [] );

	// Build query args from view state.
	const queryArgs = useMemo( () => {
		const sortField = view.sort?.field
			? sortMap[ view.sort.field ] || view.sort.field
			: sortMap[ defaultSort.field ] || defaultSort.field;
		const sortDir = view.sort?.direction || defaultSort.direction;

		const args = {
			per_page: view.perPage,
			page: view.page,
			sort: `${ sortField }:${ sortDir }`,
		};

		// Search query.
		if ( view.search ) {
			args.query = view.search;
		}

		// Merge entity-specific query args.
		if ( buildQueryArgs ) {
			Object.assign( args, buildQueryArgs( { view, status, filters } ) );
		}

		return args;
	}, [ view, status, filters, sortMap, defaultSort, buildQueryArgs ] );

	// Fetch records.
	const {
		records,
		hasResolved,
		totalItems,
		totalPages,
	} = useEntityRecords( kind, entity, queryArgs );

	const paginationInfo = useMemo(
		() => ( {
			totalItems,
			totalPages,
		} ),
		[ totalItems, totalPages ]
	);

	/**
	 * Invalidate the current entity list query so data is re-fetched.
	 * Call after mutations (archive, duplicate, etc.) that change the list.
	 */
	const invalidateList = useCallback( () => {
		invalidateResolution( 'getEntityRecords', [ kind, entity, queryArgs ] );
	}, [ invalidateResolution, kind, entity, queryArgs ] );

	return {
		// View state.
		view,
		setView,

		// Tab state.
		status,
		setStatus: changeStatus,

		// Custom filters.
		filters,
		setFilter,

		// Data.
		records: records || [],
		hasResolved,
		paginationInfo,

		// Mutation helpers.
		invalidateList,

		// Query args (for debugging or extension).
		queryArgs,
	};
}
