/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import { ScEmpty, ScSpacing } from '@surecart/components-react';

import Box from '../../../ui/Box';
import BundleItem from './BundleItem';
import BundleItemDrawer from './BundleItemDrawer';
import BundleItemPicker from './BundleItemPicker';
import { componentProductIdOf, normalizeBundleItem } from './utils';

const sortByPosition = (a, b) => (a.position ?? 0) - (b.position ?? 0);
const readItems = (raw) => (Array.isArray(raw) ? raw : raw?.data ?? []);

export default ({ product, updateProduct, loading }) => {
	const items = readItems(product?.bundle_items).slice().sort(sortByPosition);

	const displayCurrency = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('surecart', 'account')
				?.currency || 'usd',
		[]
	);

	const [editingIndex, setEditingIndex] = useState(null);
	const editingItem = editingIndex !== null ? items[editingIndex] : null;

	const replace = (next) =>
		updateProduct({ bundle_items: next.map(normalizeBundleItem) });

	const addComponent = (componentProductId) => {
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
		<BundleItemPicker
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
								<BundleItem
									item={item}
									onEdit={() => setEditingIndex(index)}
									onUpdate={(patch) => updateAt(index, patch)}
									onRemove={() => removeAt(index)}
									mixedBasisWarning={hasMixedBasis(item)}
								/>
							</div>
						</SortableItem>
					))}
				</SortableList>
			)}

			{editingItem && (
				<BundleItemDrawer
					key={editingItem.id || componentProductIdOf(editingItem)}
					item={editingItem}
					currency={displayCurrency}
					isOpen={true}
					onClose={() => setEditingIndex(null)}
					onSave={(patch) => updateAt(editingIndex, patch)}
				/>
			)}
		</Box>
	);
};
