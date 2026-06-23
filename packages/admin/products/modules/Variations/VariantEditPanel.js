// Reuses EditVariant outside the Edit Product page. Variants come from the
// same core-data query the inline rows resolved on expand, so opening the
// drawer is instant — no fetch. Save is fire-and-forget: drawer closes
// immediately, the single-variant PATCH runs in the background, parent
// drives a row-level saving indicator via onSavingStart / onSavingEnd.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

import EditVariant from './EditVariant';
import { toVariantsArray } from './utils';
import { variantsQuery, patchVariant } from '../../list/variants';

export default ({
	product,
	variantId,
	onClose,
	onSaved,
	onSavingStart,
	onSavingEnd,
}) => {
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const productId = product?.id;

	const variants = useSelect(
		(select) =>
			select(coreStore).getEntityRecords(
				'surecart',
				'variant',
				variantsQuery(productId)
			),
		[productId]
	);

	// Option labels come from the lean list row — it expands
	// `variant_options` (see list/buildQuery.js BASE_EXPANDS).
	const variantOptions = useMemo(
		() => toVariantsArray(product?.variant_options),
		[product]
	);

	const sourceVariant = useMemo(
		() => (variants || []).find((v) => v?.id === variantId) || null,
		[variants, variantId]
	);

	const [draft, setDraft] = useState(null);

	useEffect(() => {
		if (!draft && sourceVariant) {
			setDraft(sourceVariant);
		}
	}, [sourceVariant, draft]);

	const updateVariant = useCallback((data) => {
		setDraft((prev) => ({ ...(prev || {}), ...data }));
	}, []);

	// Returns synchronously so the drawer closes immediately. The
	// IIFE captures everything by closure and runs to completion
	// even after the panel unmounts.
	const handleDone = useCallback(() => {
		if (!draft) return;
		const id = variantId;
		const snapshot = draft;
		const previous = sourceVariant;

		if (typeof onSavingStart === 'function') onSavingStart(id);

		// Optimistic: push the draft into the store now so the inline row
		// shows the edit the moment the drawer closes. Receives merge into
		// the items map every variants query reads from — no invalidation.
		receiveEntityRecords('surecart', 'variant', { ...previous, ...snapshot });

		(async () => {
			try {
				// Direct PATCH (not saveEntityRecord) — saving through
				// core-data would refetch every expanded product's variants.
				// The response is authoritative: it carries server-computed
				// fields (display_amount etc.) the optimistic draft lacks.
				const saved = await patchVariant(id, snapshot);
				receiveEntityRecords('surecart', 'variant', saved);
				createSuccessNotice(__('Variant updated.', 'surecart'), {
					type: 'snackbar',
				});
				if (typeof onSaved === 'function') onSaved();
			} catch (error) {
				// Roll the optimistic write back to the pre-edit record.
				receiveEntityRecords('surecart', 'variant', previous);
				createErrorNotice(
					error?.message ||
						__('Failed to update variant.', 'surecart'),
					{ type: 'snackbar' }
				);
			} finally {
				if (typeof onSavingEnd === 'function') onSavingEnd(id);
			}
		})();
	}, [
		draft,
		sourceVariant,
		variantId,
		receiveEntityRecords,
		createSuccessNotice,
		createErrorNotice,
		onSaved,
		onSavingStart,
		onSavingEnd,
	]);

	// Wait for variant data — drawer flickers empty otherwise. The query is
	// normally cache-warm (the row the user clicked came from it).
	if (!sourceVariant || !draft) {
		return null;
	}

	return (
		<EditVariant
			variant={draft}
			product={product}
			updateVariant={updateVariant}
			variantOptions={variantOptions}
			onDone={handleDone}
			onRequestClose={onClose}
		/>
	);
};
