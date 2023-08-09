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
	ScFlex,
	ScFormControl,
	ScIcon,
	ScQuantitySelect,
	ScSwitch,
	ScTooltip,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import StockAdjustmentModal from './StockAdjustment';

export default ({ product, updateProduct, loading, setStock }) => {
	const [model, setModel] = useState(false);

	return (
		<Box title={__('Inventory', 'surecart')} loading={loading}>
			<ScSwitch
				checked={!!product?.stock_enabled}
				onScChange={(e) => {
					updateProduct({
						stock_enabled: e.target.checked ? 1 : 0,
					});
				}}
			>
				{__('Track quantity', 'surecart')}
				<span slot="description">
					{__('Track the quantity of this product.', 'surecart')}
				</span>
			</ScSwitch>

			{!!product?.stock_enabled && product?.variants?.length === 0 && (
				<>
					<ScFlex justifyContent="flex-start">
						<ScFormControl label={__('Stock quantity', 'surecart')}>
							<ScFlex alignItems="center">
								<ScQuantitySelect
									quantity={product?.stock}
									onScChange={(e) => setStock(e.detail)}
									allowNegative={true}
								/>
								<ScTooltip
									type="text"
									text={__(
										'Adjust stock quantity',
										'surecart'
									)}
									css={css`
										margin-left: 0.5rem;
									`}
								>
									<ScButton
										type="text"
										onClick={() => setModel(true)}
									>
										<ScIcon name="edit" slot="prefix" />
									</ScButton>
								</ScTooltip>
							</ScFlex>
						</ScFormControl>
					</ScFlex>
				</>
			)}

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
					{__('Allow Out of stock selling', 'surecart')}
					<span slot="description">
						{__('Continue selling when out of stock', 'surecart')}
					</span>
				</ScSwitch>
			)}

			{model && (
				<StockAdjustmentModal
					open={model}
					onRequestClose={() => setModel(false)}
					product={product}
					updateProduct={updateProduct}
					initialStock={product?.initial_stock}
					loading={loading}
				/>
			)}
		</Box>
	);
};
