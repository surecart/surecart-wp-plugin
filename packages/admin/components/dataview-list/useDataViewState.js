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
 *   buildQueryArgs: ({ view, status, filters }) => {
 *     const args = {};
 *     if (status === 'active') args.archived = false;
 *     if (filters.collectionId) args.product_collection_ids = [filters.collectionId];
 *     return args;
 *   },
 * });
 */
import { useMemo, useState, useCallback } from 'react';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { getQueryArgs } from '@wordpress/url';

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
	} = config;

	// Status tab state.
	const [ status, setStatus ] = useState( defaultStatus );

	// Custom filter state (entity-specific filters like collectionId).
	// Seed with initialFilters from config (e.g. from URL query params).
	const [ filters, setFilters ] = useState( initialFilters );

	const { invalidateResolution } = useDispatch( coreStore );

	// DataView view state.
	const [ view, setView ] = useState( {
		type: 'table',
		perPage,
		page: 1,
		sort: defaultSort,
		search: '',
		filters: [],
		fields: defaultFields,
		layout: {
			styles: layoutStyles,
		},
	} );

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
