/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScIcon,
	ScPriceInput,
	ScQuantitySelect,
} from '@surecart/components-react';

import HelpTooltip from '../../../components/HelpTooltip';
import Thumb from './Thumb';
import ComponentName from './ComponentName';
import { productView } from './utils';
import useBundleItemProduct from './useBundleItemProduct';

export default ({ item, currency, isOpen, onClose, onSave }) => {
	const product = useBundleItemProduct(item);
	const {
		name: componentName,
		image,
		link: productLink,
	} = productView(product);

	const [qty, setQty] = useState(item?.quantity ?? 1);
	const [basis, setBasis] = useState(item?.basis_amount ?? '');

	const handleSubmit = (e) => {
		e?.stopPropagation?.();
		const nextQty = Math.max(1, parseInt(qty, 10) || 1);
		const trimmed = String(basis ?? '').trim();
		// `basis_amount` is stored in minor currency units (integer cents) on the API,
		// matching the rest of SureCart's monetary fields — so `parseInt` is intentional.
		const nextBasis =
			trimmed === '' ? null : Math.max(0, parseInt(trimmed, 10) || 0);

		onSave({ quantity: nextQty, basis_amount: nextBasis });
		onClose();
	};

	const labelStyle = css`
		font-size: var(--sc-input-label-font-size);
		font-weight: var(--sc-input-label-font-weight);
		color: var(--sc-input-label-color);
		margin-bottom: var(--sc-spacing-small);
	`;

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
						<div>
							<div css={labelStyle}>
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
								<Thumb src={image} size={40} />
								<div
									css={css`
										flex: 1;
										min-width: 0;
										font-weight: 500;
									`}
								>
									<ComponentName
										name={componentName}
										link={productLink}
									/>
								</div>
							</div>
						</div>

						<div>
							<div css={labelStyle}>
								{__('Quantity', 'surecart')}
							</div>
							<ScQuantitySelect
								min={1}
								quantity={Number(qty) || 1}
								productName={componentName}
								onScChange={(e) => setQty(e.detail)}
							/>
						</div>

						<div>
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
									font-weight: var(
										--sc-input-label-font-weight
									);
								`}
							>
								{__('Basis amount', 'surecart')}
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
												{__(
													'How the bundle price is split for tax',
													'surecart'
												)}
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
									<ScIcon
										name="info"
										style={{
											opacity: 0.5,
											fontSize: '14px',
										}}
									/>
								</HelpTooltip>
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
							/>
							<div
								css={css`
									margin-top: 6px;
									font-size: 12px;
									color: var(--sc-color-gray-600);
								`}
							>
								{__(
									"Leave blank to split evenly by quantity. A common starting point is each component's standalone price.",
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
