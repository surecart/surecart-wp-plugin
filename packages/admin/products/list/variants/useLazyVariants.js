import { useCallback, useMemo } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import useExpandedVariants from './useExpandedVariants';
import { variantsQuery, byPosition } from './variantsQuery';

// Variants for expanded rows come straight from core-data: calling
// getEntityRecords inside useSelect kicks off resolution, dedupes
// concurrent callers (the edit drawer reads the same query), and caches
// results. The *product* entity can't be read this way — the lean list
// resolver clobbers its single records (see list/buildQuery.js) — but the
// variant entity has no such resolver, so redux owns fetch/loading/failure
// state here and no component-level cache is needed.
export default function useLazyVariants() {
	const expanded = useExpandedVariants();
	const { invalidateResolution } = useDispatch(coreStore);

	// Two flat maps so useSelect's shallow compare sees stable values
	// (record arrays / booleans) and skips re-renders on unrelated
	// core-data changes. Nesting these in one object would defeat that.
	const recordsById = useSelect(
		(select) => {
			const out = {};
			for (const id of expanded.ids) {
				out[id] = select(coreStore).getEntityRecords(
					'surecart',
					'variant',
					variantsQuery(id)
				);
			}
			return out;
		},
		[expanded.ids]
	);

	const finishedById = useSelect(
		(select) => {
			const out = {};
			for (const id of expanded.ids) {
				out[id] = select(coreStore).hasFinishedResolution(
					'getEntityRecords',
					['surecart', 'variant', variantsQuery(id)]
				);
			}
			return out;
		},
		[expanded.ids]
	);

	const { variantsByProduct, loadingIds, failedIds } = useMemo(() => {
		const result = {
			variantsByProduct: {},
			loadingIds: new Set(),
			failedIds: new Set(),
		};
		for (const [id, records] of Object.entries(recordsById)) {
			if (records) {
				result.variantsByProduct[id] = [...records].sort(byPosition);
			}
			// Every variant save invalidates ALL variant queries' resolution
			// (core-data's invalidateCache), so "unfinished" alone can't mean
			// loading — the placeholder would replace live rows on each save.
			// Loading is only "nothing to show yet"; rows with records keep
			// rendering while re-resolution confirms them in the background.
			if (!finishedById[id] && !records) {
				result.loadingIds.add(id);
			} else if (finishedById[id] && records === null) {
				// Success always yields an array — null after resolution
				// means the fetch failed.
				result.failedIds.add(id);
			}
		}
		return result;
	}, [recordsById, finishedById]);

	// Drop the cached query and refetch — used by the error retry button
	// and after a variant edit/delete so the inline rows reflect the
	// change. Existing records stay on screen until the refetch lands.
	const retry = useCallback(
		(id) => {
			if (!id) return;
			invalidateResolution('getEntityRecords', [
				'surecart',
				'variant',
				variantsQuery(id),
			]);
		},
		[invalidateResolution]
	);

	return useMemo(
		() => ({
			...expanded,
			variantsByProduct,
			loadingIds,
			failedIds,
			retry,
		}),
		[expanded, variantsByProduct, loadingIds, failedIds, retry]
	);
}
