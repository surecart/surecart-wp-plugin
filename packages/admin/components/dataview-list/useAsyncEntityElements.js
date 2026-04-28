/**
 * Async filter-element resolver for entity-backed dropdowns.
 *
 * Replaces the eager-fetch pattern (e.g. `useEntityRecords('product-collection',
 * { per_page: 100 })`) with a typeahead-aware resolver that DataViews can call
 * with the user's current input.
 *
 * Two pieces are returned:
 *   - `elements`: the initial pre-fetched batch (sensible defaults so the
 *     dropdown isn't empty before the user types).
 *   - `getElements`: an async resolver compatible with DataViews `field.elements`
 *     when given a function. Receives `{ search }` and returns
 *     `{ value, label }[]`.
 *
 * The resolver caches by query string and short-circuits empty queries.
 */
import { useMemo, useRef, useCallback } from 'react';
import { useEntityRecords } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const DEFAULT_PER_PAGE = 20;

const useAsyncEntityElements = ({
	kind = 'surecart',
	entity,
	endpoint,
	mapToElement,
	perPage = DEFAULT_PER_PAGE,
	defaultQueryArgs = {},
}) => {
	// Pre-fetch a small first page so the dropdown isn't empty on open.
	const { records: prefetchedRecords } = useEntityRecords(kind, entity, {
		per_page: perPage,
		...defaultQueryArgs,
	});

	const elements = useMemo(
		() => (prefetchedRecords || []).map(mapToElement),
		[prefetchedRecords, mapToElement]
	);

	// Cache search → results so repeated keystrokes don't re-fetch.
	const cacheRef = useRef(new Map());
	const inflightRef = useRef(new Map());

	const getElements = useCallback(
		async ({ search } = {}) => {
			const key = (search || '').trim().toLowerCase();
			if (cacheRef.current.has(key)) {
				return cacheRef.current.get(key);
			}
			if (inflightRef.current.has(key)) {
				return inflightRef.current.get(key);
			}

			const promise = apiFetch({
				path: addQueryArgs(endpoint, {
					per_page: perPage,
					...defaultQueryArgs,
					...(key ? { query: key } : {}),
				}),
			})
				.then((records) => {
					const mapped = (records || []).map(mapToElement);
					cacheRef.current.set(key, mapped);
					inflightRef.current.delete(key);
					return mapped;
				})
				.catch(() => {
					inflightRef.current.delete(key);
					return [];
				});

			inflightRef.current.set(key, promise);
			return promise;
		},
		[endpoint, perPage, mapToElement, defaultQueryArgs]
	);

	return { elements, getElements };
};

export default useAsyncEntityElements;
