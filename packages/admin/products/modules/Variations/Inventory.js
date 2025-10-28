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

import StockAdjustmentModal from '../Inventory/StockAdjustmentModal';
import useVariantValue from '../../hooks/useVariantValue';
import DrawerSection from '../../../ui/DrawerSection';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const [model, setModel] = useState(false);
	const { getValue, isOverridden } = useVariantValue({ variant, product });

	/**
	 * Reset a specific field to use product default.
	 */
	const resetField = (fieldKey) => {
		updateVariant({ [fieldKey]: null });
	};

	return (
		<DrawerSection
			title={__('Inventory', 'surecart')}
			suffix={
				<ResetOverridesDropdown
					fields={[
						{
							key: 'stock_enabled',
							label: __('Track quantity', 'surecart'),
						},
						{
							key: 'allow_out_of_stock_purchases',
							label: __('Out of stock selling', 'surecart'),
						},
					]}
					isOverridden={isOverridden}
					onReset={resetField}
				/>
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-small);
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						gap: var(--sc-spacing-small);
					`}
				>
					<ScSwitch
						checked={!!getValue('stock_enabled')}
						onScChange={(e) => {
							updateVariant({
								stock_enabled: e.target.checked ? 1 : 0,
							});
						}}
						name="stock_enabled"
						css={css`
							flex: 1;
						`}
					>
						{__('Track Quantity', 'surecart')}
						<span slot="description">
							{__(
								'Track the quantity of this variant.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</div>

				{!!getValue('stock_enabled') && (
					<div
						css={css`
							display: flex;
							align-items: flex-start;
							justify-content: space-between;
							gap: var(--sc-spacing-small);
						`}
					>
						<ScSwitch
							checked={!!getValue('allow_out_of_stock_purchases')}
							onScChange={(e) => {
								updateVariant({
									allow_out_of_stock_purchases: e.target
										.checked
										? 1
										: 0,
								});
							}}
							css={css`
								flex: 1;
							`}
						>
							{__('Allow Out Of Stock Selling', 'surecart')}
							<span slot="description">
								{__(
									'Continue selling when out of stock',
									'surecart'
								)}
							</span>
						</ScSwitch>
					</div>
				)}

				{!!getValue('stock_enabled') && (
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
									(variant?.available_stock || 0) +
									(variant?.stock_adjustment || 0)
								}
								onScChange={(e) =>
									updateVariant({
										stock_adjustment:
											e.detail -
											(variant?.available_stock || 0),
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
						stock={variant?.stock}
						available={variant?.available_stock}
						adjustment={variant?.stock_adjustment}
						onUpdate={updateVariant}
					/>
				)}

				<div
					css={css`
						display: flex;
						align-items: flex-start;
						gap: var(--sc-spacing-small);
					`}
				>
					<ScInput
						name="sku"
						label={__('SKU (Stock Keeping Unit)', 'surecart')}
						value={variant?.sku || ''}
						placeholder={!isOverridden('sku') ? product?.sku : ''}
						onScInput={(e) => {
							updateVariant({
								sku: e.target.value,
							});
						}}
						css={css`
							flex: 1;
						`}
					/>
				</div>
			</div>
		</DrawerSection>
	);
};
