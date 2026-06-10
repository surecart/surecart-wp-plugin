import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useExpandedVariants from './useExpandedVariants';
import { readVariants } from './injectVariantRows';
import fetchProductVariants from './fetchProductVariants';

const addId = (setter, id) =>
	setter((prev) => {
		if (prev.has(id)) return prev;
		const next = new Set(prev);
		next.add(id);
		return next;
	});

const removeId = (setter, id) =>
	setter((prev) => {
		if (!prev.has(id)) return prev;
		const next = new Set(prev);
		next.delete(id);
		return next;
	});

// Lazily fetch variants for expanded rows via the single-product route. We
// fetch directly (not through core-data's getEntityRecord) because the lean
// list pre-resolves those records variant-less — see fetchProductVariants.
export default function useLazyVariants() {
	const expanded = useExpandedVariants();
	const [variantsByProduct, setVariantsByProduct] = useState({});
	const [loadingIds, setLoadingIds] = useState(() => new Set());
	const [failedIds, setFailedIds] = useState(() => new Set());
	const inflight = useRef(new Set());
	const mounted = useRef(true);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[]
	);

	const load = useCallback((id) => {
		if (!id || inflight.current.has(id)) return;
		inflight.current.add(id);
		addId(setLoadingIds, id);
		removeId(setFailedIds, id);

		fetchProductVariants(id)
			.then((product) => {
				if (!mounted.current) return;
				setVariantsByProduct((prev) => ({
					...prev,
					[id]: readVariants(product),
				}));
			})
			.catch(() => {
				if (mounted.current) addId(setFailedIds, id);
			})
			.finally(() => {
				inflight.current.delete(id);
				if (mounted.current) removeId(setLoadingIds, id);
			});
	}, []);

	// Fetch variants for any expanded product we haven't loaded yet.
	useEffect(() => {
		for (const id of expanded.ids) {
			if (!(id in variantsByProduct) && !failedIds.has(id)) {
				load(id);
			}
		}
	}, [expanded.ids, variantsByProduct, failedIds, load]);

	// Drop a cached entry and refetch — used for the error retry button and
	// after a variant edit/delete so the inline rows reflect the change.
	const retry = useCallback(
		(id) => {
			if (!id) return;
			setVariantsByProduct((prev) => {
				if (!(id in prev)) return prev;
				const next = { ...prev };
				delete next[id];
				return next;
			});
			removeId(setFailedIds, id);
			load(id);
		},
		[load]
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
