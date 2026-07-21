import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'surecart.products-list.expandedVariants';

const readInitial = () => {
	try {
		const raw = window.localStorage?.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		return Array.isArray(parsed) ? parsed : [];
	} catch (_e) {
		return [];
	}
};

const writePersisted = (ids) => {
	try {
		window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(ids));
	} catch (_e) {
		// Fail open on quota / private mode — in-memory state still works.
	}
};

// Set for O(1) lookup, persisted as array. localStorage (not user-meta)
// because expansion is ephemeral UI state, not a saved view preference.
export default function useExpandedVariants() {
	const [ids, setIds] = useState(() => new Set(readInitial()));

	useEffect(() => {
		writePersisted(Array.from(ids));
	}, [ids]);

	const toggle = useCallback((productId) => {
		setIds((prev) => {
			const next = new Set(prev);
			if (next.has(productId)) {
				next.delete(productId);
			} else {
				next.add(productId);
			}
			return next;
		});
	}, []);

	const collapse = useCallback((productId) => {
		setIds((prev) => {
			if (!prev.has(productId)) return prev;
			const next = new Set(prev);
			next.delete(productId);
			return next;
		});
	}, []);

	const isExpanded = useCallback((productId) => ids.has(productId), [ids]);

	return useMemo(
		() => ({ ids, toggle, collapse, isExpanded }),
		[ids, toggle, collapse, isExpanded]
	);
}
