/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import DataTable from '../../../components/DataTable';
import VariantItem from './VariantItem';

export default ({ product, updateProduct, loading }) => {
	/**
	 * Get only active prices.
	 */
	const prices = useSelect(
		(select) =>
			select(coreStore).getEntityRecords('surecart', 'price', {
				context: 'edit',
				product_ids: [product?.id],
				per_page: 100,
			}) || [].filter((price) => !price?.archived),
		[product?.id]
	);

	/**
	 * Update a variant by index.
	 */
	const updateVariant = (data, variantIndex) => {
		updateProduct({
			variants: product?.variants.map((item, index) =>
				index !== variantIndex ? item : { ...item, ...data }
			),
		});
	};

	return (
		<DataTable
			css={css`
				border-top: 1px solid var(--sc-color-gray-200);
			`}
			title={__('', 'surecart')}
			loading={loading}
			columns={{
				variant: {
					label: __('Variant', 'surecart'),
					width: '200px',
				},
				amount: {
					label: __('Price', 'surecart'),
					width: '150px',
				},
				...(!!product?.stock_enabled && {
					stock: {
						label: __('Quantity', 'surecart'),
						width: '150px',
					},
				}),
				sku: {
					label: __('SKU', 'surecart'),
					width: '150px',
				},
				actions: {
					label: __('', 'surecart'),
				},
			}}
			items={(product?.variants ?? []).map((variant, index) => {
				return VariantItem({
					variant: {
						...variant,
						index,
					},
					updateVariant: (updates) => updateVariant(updates, index),
					product,
					updateProduct,
					prices,
				});
			})}
		/>
	);
};
