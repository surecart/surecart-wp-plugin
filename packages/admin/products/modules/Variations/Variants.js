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
	const { prices } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [product?.id], per_page: 100 },
			];

			return {
				prices: select(coreStore).getEntityRecords(...queryArgs),
			};
		},
		[product?.id]
	);

	const updateVariant = (updates, index) => {
		const variants = product?.variants.map((variant, index2) => {
			if (index2 === index) {
				let newVariant = { ...variant };

				updates.forEach(({ name, value }) => {
					newVariant[name] = value;
					if (name === 'stock') {
						newVariant['stock_adjustment'] =
							value - variant.initial_stock || 0;
					}
				});

				return newVariant;
			}
			return variant;
		});

		updateProduct({ variants });
	};

	const getColumns = () => {
		let columns = {
			variant: {
				label: __('Variant', 'surecart'),
				width: '200px',
			},
			amount: {
				label: __('Price', 'surecart'),
				width: '150px',
			},
		};

		if (!!product?.stock_enabled) {
			columns = {
				...columns,
				stock: {
					label: __('Stock qty', 'surecart'),
					width: '150px',
				},
			};
		}

		return {
			...columns,
			sku: {
				label: __('SKU', 'surecart'),
				width: '150px',
			},
			actions: {
				label: __('', 'surecart'),
			},
		};
	};

	return (
		<DataTable
			css={css`
				border-top: 1px solid var(--sc-color-gray-200);
			`}
			title={__('', 'surecart')}
			loading={loading}
			columns={getColumns()}
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
		></DataTable>
	);
};
