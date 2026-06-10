// Reuses EditVariant outside the Edit Product page. Save is
// fire-and-forget: drawer closes immediately, PATCH runs in the
// background, parent drives a row-level saving indicator via the
// onSavingStart / onSavingEnd callbacks.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

import EditVariant from './EditVariant';
import { toVariantsArray } from './utils';
import { fetchProductVariants } from '../../list/variants';

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

	// Fetch the full product directly. The lean list pre-resolves this
	// product's core-data record variant-less, so reading it via core-data
	// would open the drawer empty — see fetchProductVariants.
	const [product, setProduct] = useState(null);
	const [loadFailed, setLoadFailed] = useState(false);

	useEffect(() => {
		let active = true;
		setProduct(null);
		setLoadFailed(false);
		fetchProductVariants(productId)
			.then((p) => active && setProduct(p))
			.catch(() => active && setLoadFailed(true));
		return () => {
			active = false;
		};
	}, [productId]);

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

	// Surface a fetch failure instead of a silently empty drawer.
	useEffect(() => {
		if (!loadFailed) return;
		createErrorNotice(
			__('Could not load the variant. Please try again.', 'surecart'),
			{ type: 'snackbar' }
		);
		onClose?.();
	}, [loadFailed, createErrorNotice, onClose]);

	// Wait for variant data — drawer flickers empty otherwise.
	if (!product || !sourceVariant || !draft) {
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
