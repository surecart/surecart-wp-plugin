/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { SortableKnob } from 'react-easy-sort';

import {
	ScButton,
	ScIcon,
	ScInput,
	ScPriceInput,
} from '@surecart/components-react';

import HelpTooltip from '../../../components/HelpTooltip';

import { componentProductOf } from './utils';

const BasisAmountTooltip = () => (
	<HelpTooltip
		position="bottom right"
		width="320px"
		content={
			<div
				css={css`
					font-size: 13px;
					line-height: 1.5;
					color: var(--sc-color-gray-700);
				`}
			>
				<p
					css={css`
						margin: 0 0 8px 0;
						font-weight: 600;
					`}
				>
					{__('How the bundle price is split for tax', 'surecart')}
				</p>
				<p
					css={css`
						margin: 0 0 8px 0;
					`}
				>
					{__(
						"Components are always free in the cart. Basis amount is an optional weighting that controls how the bundle's total tax is allocated across components — useful when components are taxed at different rates.",
						'surecart'
					)}
				</p>
				<p
					css={css`
						margin: 0;
					`}
				>
					{__(
						"Leave blank to split evenly by quantity. A common starting point is each component's standalone price.",
						'surecart'
					)}
				</p>
			</div>
		}
	>
		<ScIcon name="info" style={{ opacity: 0.5, fontSize: '14px' }} />
	</HelpTooltip>
);

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

	// Local state for the inputs. ScPriceInput holds value in cents; we just
	// pass `item.basis_amount` (cents) straight through.
	const [qty, setQty] = useState(item.quantity ?? 1);
	const [basis, setBasis] = useState(item.basis_amount ?? '');

	useEffect(() => setQty(item.quantity ?? 1), [item.quantity]);
	useEffect(() => setBasis(item.basis_amount ?? ''), [item.basis_amount]);

	const commitQty = () => {
		const next = Math.max(1, parseInt(qty, 10) || 1);
		if (String(next) !== String(qty)) setQty(next);
		if (next !== item.quantity) onUpdate({ quantity: next });
	};

	const commitBasis = () => {
		// Empty string → null (= "weight by quantity" per the platform spec).
		// Anything else is already cents emitted by ScPriceInput on scChange.
		const trimmed = String(basis ?? '').trim();
		const next =
			trimmed === '' ? null : Math.max(0, parseInt(trimmed, 10) || 0);
		if (next !== item.basis_amount) onUpdate({ basis_amount: next });
	};

	return (
		<div
			css={css`
				padding: 28px;
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
								color: var(--sc-color-primary-600);
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
						display: flex;
						gap: var(--sc-spacing-medium);
						align-items: flex-end;
						flex-wrap: wrap;
					`}
				>
					<div
						css={css`
							width: 90px;
						`}
					>
						<ScInput
							label={__('Quantity', 'surecart')}
							type="number"
							min="1"
							value={String(qty)}
							onScChange={(e) => setQty(e.target.value)}
							onScBlur={commitQty}
						/>
					</div>
					<div
						css={css`
							width: 140px;
						`}
					>
						<div
							css={css`
								display: inline-flex;
								align-items: center;
								gap: 4px;
								margin-bottom: var(
									--sc-input-label-margin,
									var(--sc-spacing-xx-small)
								);
								color: var(--sc-input-label-color);
								font-size: var(--sc-input-label-font-size);
								font-weight: var(--sc-input-label-font-weight);
								text-transform: var(
									--sc-input-label-text-transform,
									none
								);
								letter-spacing: var(
									--sc-input-label-letter-spacing,
									0
								);
							`}
						>
							{__('Basis amount', 'surecart')}
							<BasisAmountTooltip />
						</div>
						<ScPriceInput
							type="number"
							min={0}
							currencyCode={
								currency || window?.scData?.currency_code
							}
							placeholder={__('Optional', 'surecart')}
							value={basis === null ? '' : basis}
							onScChange={(e) => setBasis(e.target.value)}
							onScBlur={commitBasis}
						/>
					</div>
				</div>

				<ScButton
					type="text"
					circle
					onClick={onRemove}
					aria-label={sprintf(
						/* translators: %s: component product name */
						__('Remove %s from this bundle', 'surecart'),
						componentName || __('component', 'surecart')
					)}
				>
					<ScIcon name="x" />
				</ScButton>
			</div>
		</div>
	);
};
