/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScInput,
	ScQuantitySelect,
	ScSwitch,
	ScTooltip,
} from '@surecart/components-react';

import StockAdjustmentModal from './StockAdjustmentModal';

import Box from '../../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	const [model, setModel] = useState(false);

	return (
		<Box
			title={__('Inventory', 'surecart')}
			loading={loading}
			css={css`
				--sc-quantity-input-max-width: 100%;
				--sc-quantity-select-width: 100%;
				--sc-quantity-control-height: var(--sc-input-height-medium);
				.components-card__body {
					gap: 20px;
				}
			`}
		>
			<ScSwitch
				checked={!!product?.stock_enabled}
				onScChange={(e) => {
					updateProduct({
						stock_enabled: e.target.checked ? 1 : 0,
					});
				}}
				name="stock_enabled"
			>
				{__('Track Quantity', 'surecart')}
				<span slot="description">
					{__('Track the quantity of this product.', 'surecart')}
				</span>
			</ScSwitch>

			{!!product?.stock_enabled && (
				<ScSwitch
					checked={!!product?.allow_out_of_stock_purchases}
					onScChange={(e) => {
						updateProduct({
							allow_out_of_stock_purchases: e.target.checked
								? 1
								: 0,
						});
					}}
				>
					{__('Allow Out Of Stock Selling', 'surecart')}
					<span slot="description">
						{__('Continue selling when out of stock', 'surecart')}
					</span>
				</ScSwitch>
			)}

			{!!product?.stock_enabled && product?.variants?.length === 0 && (
				<ScFormControl
					label={__('Available Stock', 'surecart')}
					css={css`
						margin-bottom: 10px;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
						`}
					>
						<ScQuantitySelect
							quantity={
								(product?.available_stock || 0) +
								(product?.stock_adjustment || 0)
							}
							onScChange={(e) =>
								updateProduct({
									stock_adjustment:
										e.detail -
										(product?.available_stock || 0),
								})
							}
							min={-9999999}
							name="stock"
						/>
						<ScTooltip
							type="text"
							text={__('Make stock adjustment', 'surecart')}
						>
							<ScButton
								id="sc-adjust-stock"
								type="text"
								circle
								onClick={() => setModel(true)}
							>
								<ScIcon name="edit-3" />
							</ScButton>
						</ScTooltip>
					</div>
				</ScFormControl>
			)}

			{model && (
				<StockAdjustmentModal
					open={model}
					onRequestClose={() => setModel(false)}
					stock={product?.stock}
					available={product?.available_stock}
					adjustment={product?.stock_adjustment}
					onUpdate={updateProduct}
					loading={loading}
				/>
			)}

			<ScInput
				name="sku"
				label={__('SKU (Stock Keeping Unit)', 'surecart')}
				value={product?.sku || ''}
				onScInput={(e) => {
					updateProduct({
						sku: e.target.value,
					});
				}}
			/>
		</Box>
	);
};
