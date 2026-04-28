// Async typeahead resolver for entity-backed filter dropdowns. Returns a
// pre-fetched `elements` array (so the dropdown isn't empty on open) plus
// `getElements({ search })` for DataViews' function-elements API. Caches
// per-query so repeated keystrokes don't re-fetch.
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
