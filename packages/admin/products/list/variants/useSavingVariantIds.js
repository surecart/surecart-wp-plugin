import { useCallback, useMemo, useState } from 'react';

// Tracks variant ids whose save is currently in flight, so the row
// renderer can show a saving indicator while the drawer is already
// closed. Not persisted — this is purely transient UI state.
export default function useSavingVariantIds() {
	const [ids, setIds] = useState(() => new Set());

	const start = useCallback((variantId) => {
		if (!variantId) return;
		setIds((prev) => {
			if (prev.has(variantId)) return prev;
			const next = new Set(prev);
			next.add(variantId);
			return next;
		});
	}, []);

	const end = useCallback((variantId) => {
		if (!variantId) return;
		setIds((prev) => {
			if (!prev.has(variantId)) return prev;
			const next = new Set(prev);
			next.delete(variantId);
			return next;
		});
	}, []);

	return useMemo(() => ({ ids, start, end }), [ids, start, end]);
}
