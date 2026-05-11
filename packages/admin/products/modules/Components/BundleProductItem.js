/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { DropdownMenu, MenuItem } from '@wordpress/components';
import { moreHorizontal, edit as editIcon, trash } from '@wordpress/icons';
import { SortableKnob } from 'react-easy-sort';

import { ScIcon, ScInput } from '@surecart/components-react';

import Confirm from '../../../components/confirm';
import { componentProductOf } from './utils';
import BundleItemDrawer from './BundleItemDrawer';

export default ({
	item,
	cachedProduct,
	currency,
	onUpdate,
	onRemove,
	mixedBasisWarning,
}) => {
	const product = componentProductOf(item) || cachedProduct;
	const componentName = item?.name || product?.name || '';
	const image =
		item?.line_item_image?.src ||
		product?.line_item_image?.src ||
		product?.featured_product_media?.media?.url;
	const productLink = product?.id
		? addQueryArgs('admin.php', {
				page: 'sc-products',
				action: 'edit',
				id: product.id,
		  })
		: null;

	const [isOpen, setIsOpen] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	// Commit on every change — Stencil scBlur fires async, so committing on
	// blur let the parent's edit record lag behind what the user saw.
	const [qty, setQty] = useState(item?.quantity ?? 1);

	useEffect(() => setQty(item?.quantity ?? 1), [item?.quantity]);

	const pushQty = (raw) => {
		const next = Math.max(1, parseInt(raw, 10) || 1);
		if (next !== item?.quantity) onUpdate({ quantity: next });
	};

	const normaliseQtyOnBlur = () => {
		const next = Math.max(1, parseInt(qty, 10) || 1);
		if (String(next) !== String(qty)) setQty(next);
	};

	const confirmDeleteMessage = sprintf(
		/* translators: %s: product name */
		__('Remove "%s" from this bundle?', 'surecart'),
		componentName || __('this product', 'surecart')
	);

	const handleDelete = () => setConfirmingDelete(true);

	const handleConfirmDelete = () => {
		setConfirmingDelete(false);
		onRemove();
	};

	return (
		<div
			css={css`
				padding: 20px 24px;
				background: white;
				border-bottom: 1px solid var(--sc-color-gray-200);
				border-top: 1px solid var(--sc-color-gray-200);
				margin-top: -1px;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 1rem;
					flex-wrap: wrap;
				`}
			>
				<SortableKnob>
					<ScIcon
						name="drag"
						css={css`
							font-size: 16px;
							cursor: grab;
							color: var(--sc-color-gray-400);
						`}
					/>
				</SortableKnob>

				{image ? (
					<img
						src={image}
						alt=""
						css={css`
							width: 48px;
							height: 48px;
							border-radius: 6px;
							object-fit: cover;
							flex-shrink: 0;
						`}
					/>
				) : (
					<div
						aria-hidden="true"
						css={css`
							width: 48px;
							height: 48px;
							border-radius: 6px;
							background: var(--sc-color-gray-100);
							flex-shrink: 0;
						`}
					/>
				)}

				<div
					css={css`
						flex: 1 1 200px;
						min-width: 0;
					`}
				>
					{productLink ? (
						<a
							href={productLink}
							target="_blank"
							rel="noopener noreferrer"
							css={css`
								font-weight: 500;
								text-decoration: none;
								&:hover {
									text-decoration: underline;
								}
							`}
						>
							{componentName}
						</a>
					) : (
						<div
							css={css`
								font-weight: 500;
								color: var(--sc-color-gray-700);
							`}
						>
							{componentName}
						</div>
					)}
					{mixedBasisWarning && (
						<div
							css={css`
								color: var(--sc-color-warning-700, #b45309);
								font-size: 12px;
								margin-top: 4px;
							`}
						>
							{__(
								'No basis amount set — this component will be allocated $0 for tax.',
								'surecart'
							)}
						</div>
					)}
				</div>

				<div
					css={css`
						width: 84px;
					`}
				>
					<ScInput
						label={__('Quantity', 'surecart')}
						type="number"
						min="1"
						value={String(qty)}
						onScChange={(e) => {
							setQty(e.target.value);
							pushQty(e.target.value);
						}}
						onScBlur={normaliseQtyOnBlur}
					/>
				</div>

				<DropdownMenu
					icon={moreHorizontal}
					label={__('More Actions', 'surecart')}
					popoverProps={{ placement: 'bottom-end' }}
					menuProps={{ style: { minWidth: '150px' } }}
				>
					{({ onClose }) => (
						<>
							<MenuItem
								icon={editIcon}
								iconPosition="left"
								onClick={() => {
									setIsOpen(true);
									onClose();
								}}
							>
								{__('Edit', 'surecart')}
							</MenuItem>
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={() => {
									handleDelete();
									onClose();
								}}
							>
								{__('Delete', 'surecart')}
							</MenuItem>
						</>
					)}
				</DropdownMenu>
			</div>

			<BundleItemDrawer
				item={item}
				cachedProduct={cachedProduct}
				currency={currency}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSave={(patch) => onUpdate(patch)}
			/>

			{confirmingDelete && (
				<Confirm
					open={confirmingDelete}
					confirmButtonText={__('Delete', 'surecart')}
					cancelButtonText={__('Cancel', 'surecart')}
					onConfirm={handleConfirmDelete}
					onRequestClose={() => setConfirmingDelete(false)}
				>
					{confirmDeleteMessage}
				</Confirm>
			)}
		</div>
	);
};
