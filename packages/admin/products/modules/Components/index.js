/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import { ScEmpty, ScSpacing } from '@surecart/components-react';

import Box from '../../../ui/Box';
import BundleProductItem from './BundleProductItem';
import BundleProductPicker from './BundleProductPicker';
import { componentProductIdOf, normalizeBundleItem } from './utils';

export default ({ product, updateProduct, loading }) => {
	const rawBundleItems = product?.bundle_items;
	const items = (
		Array.isArray(rawBundleItems)
			? rawBundleItems
			: rawBundleItems?.data || []
	)
		.slice()
		.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

	const displayCurrency = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('surecart', 'account')
				?.currency || 'usd',
		[]
	);

	const [productCache, setProductCache] = useState({});

	useEffect(() => {
		const next = {};
		let changed = false;
		items.forEach((it) => {
			const cp = it?.component_product;
			if (cp && typeof cp === 'object' && cp.id && !productCache[cp.id]) {
				next[cp.id] = cp;
				changed = true;
			}
		});
		if (changed) {
			setProductCache((prev) => ({ ...prev, ...next }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		items
			.map((it) => `${it.id || ''}|${componentProductIdOf(it) || ''}`)
			.join(','),
	]);

	// Bail after hooks so the hook call order stays stable across renders.
	if (!product?.bundle) return null;

	const replace = (next) =>
		updateProduct({ bundle_items: next.map(normalizeBundleItem) });

	const addComponent = (componentProductId, componentProduct) => {
		if (componentProduct?.id) {
			setProductCache((prev) =>
				prev[componentProductId] === componentProduct
					? prev
					: { ...prev, [componentProductId]: componentProduct }
			);
		}
		replace([
			...items,
			{
				component_product: componentProductId,
				quantity: 1,
				position: items.length,
			},
		]);
	};

	const updateAt = (index, patch) =>
		replace(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

	const removeAt = (index) => replace(items.filter((_, i) => i !== index));

	const onSortEnd = (oldIndex, newIndex) => {
		if (oldIndex === newIndex) return;
		replace(
			arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
				...it,
				position: idx,
			}))
		);
	};

	const someHaveBasis = items.some(
		(i) => i.basis_amount !== null && i.basis_amount !== undefined
	);
	const hasMixedBasis = (item) =>
		someHaveBasis &&
		(item.basis_amount === null || item.basis_amount === undefined);

	const excludeIds = [product.id, ...items.map(componentProductIdOf)].filter(
		Boolean
	);

	const picker = (
		<BundleProductPicker
			excludeIds={excludeIds}
			onSelect={addComponent}
			disabled={loading}
		/>
	);

	return (
		<Box
			title={__('Bundle Products', 'surecart')}
			loading={loading}
			css={
				!loading &&
				css`
					* {
						box-sizing: border-box;
					}
					.components-card-body {
						padding: 0;
					}
				`
			}
			footer={items.length ? picker : null}
		>
			{!items.length ? (
				<ScEmpty icon="shopping-bag">
					<ScSpacing>
						<p
							css={css`
								font-size: 14px;
							`}
						>
							{__(
								'Choose products to include in this bundle.',
								'surecart'
							)}
						</p>
						{picker}
					</ScSpacing>
				</ScEmpty>
			) : (
				<SortableList
					onSortEnd={onSortEnd}
					draggedItemClassName="sc-dragging"
				>
					{items.map((item, index) => (
						<SortableItem
							key={
								item.id ||
								`pending-${componentProductIdOf(item) || index}`
							}
						>
							<div>
								<BundleProductItem
									item={item}
									cachedProduct={
										productCache[componentProductIdOf(item)]
									}
									currency={displayCurrency}
									onUpdate={(patch) => updateAt(index, patch)}
									onRemove={() => removeAt(index)}
									mixedBasisWarning={hasMixedBasis(item)}
								/>
							</div>
						</SortableItem>
					))}
				</SortableList>
			)}
		</Box>
	);
};
