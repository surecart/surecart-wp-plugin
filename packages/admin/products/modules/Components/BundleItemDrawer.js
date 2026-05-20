/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import {
	ScButton,
	ScDrawer,
	ScForm,
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
				<p css={css`margin: 0 0 8px 0; font-weight: 600;`}>
					{__('How the bundle price is split for tax', 'surecart')}
				</p>
				<p css={css`margin: 0 0 8px 0;`}>
					{__(
						"Components are always free in the cart. Basis amount is an optional weighting that controls how the bundle's total tax is allocated across components — useful when components are taxed at different rates.",
						'surecart'
					)}
				</p>
				<p css={css`margin: 0;`}>
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
	isOpen,
	onClose,
	onSave,
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

	// Drawer-local draft state, seeded from `item` each time the drawer opens.
	const [qty, setQty] = useState(item?.quantity ?? 1);
	const [basis, setBasis] = useState(item?.basis_amount ?? '');

	useEffect(() => {
		if (isOpen) {
			setQty(item?.quantity ?? 1);
			setBasis(item?.basis_amount ?? '');
		}
	}, [isOpen, item?.quantity, item?.basis_amount]);

	const handleSubmit = (e) => {
		e?.stopPropagation?.();
		const nextQty = Math.max(1, parseInt(qty, 10) || 1);
		const trimmed = String(basis ?? '').trim();
		const nextBasis =
			trimmed === '' ? null : Math.max(0, parseInt(trimmed, 10) || 0);

		onSave({ quantity: nextQty, basis_amount: nextBasis });
		onClose();
	};

	return (
		<ScForm onScFormSubmit={handleSubmit}>
			<ScDrawer
				label={__('Edit Bundle Item', 'surecart')}
				style={{
					'--sc-drawer-size': '32rem',
					'--sc-input-label-margin': 'var(--sc-spacing-small)',
				}}
				onScRequestClose={onClose}
				open={isOpen}
				stickyHeader
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
						background: var(--sc-color-gray-50);
					`}
				>
					<div
						css={css`
							padding: 30px;
							display: grid;
							gap: 2em;
						`}
					>
						{/* Component product preview — read-only. */}
						<div>
							<div
								css={css`
									font-size: var(--sc-input-label-font-size);
									font-weight: var(--sc-input-label-font-weight);
									color: var(--sc-input-label-color);
									margin-bottom: var(--sc-spacing-small);
								`}
							>
								{__('Component Product', 'surecart')}
							</div>
							<div
								css={css`
									display: flex;
									align-items: center;
									gap: 12px;
									padding: 12px;
									background: white;
									border: 1px solid var(--sc-color-gray-200);
									border-radius: 6px;
								`}
							>
								{image ? (
									<img
										src={image}
										alt=""
										css={css`
											width: 40px;
											height: 40px;
											border-radius: 4px;
											object-fit: cover;
											flex-shrink: 0;
										`}
									/>
								) : (
									<div
										aria-hidden="true"
										css={css`
											width: 40px;
											height: 40px;
											border-radius: 4px;
											background: var(--sc-color-gray-100);
											flex-shrink: 0;
										`}
									/>
								)}
								<div
									css={css`
										flex: 1;
										min-width: 0;
										font-weight: 500;
									`}
								>
									{productLink ? (
										<a
											href={productLink}
											target="_blank"
											rel="noopener noreferrer"
											css={css`
												color: var(--sc-color-primary-500);
												text-decoration: none;
												&:hover { text-decoration: underline; }
											`}
										>
											{componentName}
										</a>
									) : (
										<span>{componentName}</span>
									)}
								</div>
							</div>
						</div>

						<ScInput
							label={__('Quantity', 'surecart')}
							type="number"
							min="1"
							value={String(qty)}
							onScChange={(e) => setQty(e.target.value)}
						/>

						<div>
							<div
								css={css`
									display: inline-flex;
									align-items: center;
									gap: 4px;
									margin-bottom: var(--sc-input-label-margin, var(--sc-spacing-xx-small));
									color: var(--sc-input-label-color);
									font-size: var(--sc-input-label-font-size);
									font-weight: var(--sc-input-label-font-weight);
								`}
							>
								{__('Basis amount', 'surecart')}
								<BasisAmountTooltip />
							</div>
							<ScPriceInput
								type="number"
								min={0}
								currencyCode={currency || window?.scData?.currency_code}
								placeholder={__('Optional', 'surecart')}
								value={basis === null ? '' : basis}
								onScChange={(e) => setBasis(e.target.value)}
							/>
							<div
								css={css`
									margin-top: 6px;
									font-size: 12px;
									color: var(--sc-color-gray-600);
								`}
							>
								{__(
									'Leave blank to split tax evenly by quantity.',
									'surecart'
								)}
							</div>
						</div>
					</div>
				</div>

				<div
					css={css`
						display: flex;
						justify-content: flex-start;
						gap: 6px;
					`}
					slot="footer"
				>
					<ScButton type="primary" submit>
						{__('Update', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScDrawer>
		</ScForm>
	);
};
