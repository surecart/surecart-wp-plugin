// Reuses EditVariant outside the Edit Product page. Save is
// fire-and-forget: drawer closes immediately, PATCH runs in the
// background, parent drives a row-level saving indicator via the
// onSavingStart / onSavingEnd callbacks.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

import EditVariant from './EditVariant';
import { toVariantsArray } from './utils';

// Alias — same envelope-or-flat normalization for variants and variant_options.
const asArray = toVariantsArray;

export default ({
	productId,
	variantId,
	onClose,
	onSaved,
	onSavingStart,
	onSavingEnd,
}) => {
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	// Triggers the resolver — the list's fetcher may not have primed
	// core-data, so without this the drawer opens empty on first click.
	const { hasResolved } = useEntityRecord('surecart', 'product', productId);

	const product = useSelect(
		(select) =>
			select(coreStore).getEditedEntityRecord(
				'surecart',
				'product',
				productId
			),
		[productId]
	);

	const variants = useMemo(() => asArray(product?.variants), [product]);
	const variantOptions = useMemo(
		() => asArray(product?.variant_options),
		[product]
	);

	const sourceVariant = useMemo(
		() => variants.find((v) => v?.id === variantId) || null,
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
		if (!product || !draft) return;
		const id = variantId;
		const snapshot = draft;
		const updatedFlat = variants.map((v) =>
			v?.id !== id ? v : { ...v, ...snapshot }
		);

		if (typeof onSavingStart === 'function') onSavingStart(id);

		(async () => {
			try {
				// Always write a flat variants array — the envelope
				// shape causes the API to silently drop siblings.
				await editEntityRecord('surecart', 'product', productId, {
					variants: updatedFlat,
				});
				await saveEditedEntityRecord('surecart', 'product', productId, {
					throwOnError: true,
				});
				createSuccessNotice(__('Variant updated.', 'surecart'), {
					type: 'snackbar',
				});
				if (typeof onSaved === 'function') onSaved();
			} catch (error) {
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
		product,
		draft,
		variants,
		variantId,
		productId,
		editEntityRecord,
		saveEditedEntityRecord,
		createSuccessNotice,
		createErrorNotice,
		onSaved,
		onSavingStart,
		onSavingEnd,
	]);

	// Wait for variant data — drawer flickers empty otherwise.
	if (!hasResolved || !sourceVariant || !draft) {
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
