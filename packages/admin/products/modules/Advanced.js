import { ScInput, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	return (
		<Box title={__('Advanced', 'surecart')} loading={loading}>
			<ScSwitch
				checked={!!product?.purchase_limit}
				onScChange={(e) => {
					updateProduct({
						purchase_limit: e.target.checked ? 1 : null,
					});
				}}
			>
				{__('Limit Per-Customer Purchases', 'surecart')}
				<span slot="description">
					{__(
						'Limit the number of times a single customer can purchase this product.',
						'surecart'
					)}
				</span>
			</ScSwitch>

			{product?.purchase_limit && (
				<ScInput
					label={__('Customer Purchase Limit', 'surecart')}
					type="number"
					value={product?.purchase_limit || 1}
					onScInput={(e) =>
						updateProduct({
							purchase_limit: parseInt(e.target.value),
						})
					}
				/>
			)}
		</Box>
	);
};
