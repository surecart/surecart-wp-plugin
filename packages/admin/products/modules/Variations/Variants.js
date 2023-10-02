/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import debounce from 'lodash/debounce';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import VariantItem from './VariantItem';
import { ScTable, ScTableCell } from '@surecart/components-react';
import { maybeConvertAmount } from '../../../util';

export default memo(({ product, updateProduct }) => {
	/**
	 * Get only active prices.
	 */
	const prices = useSelect(
		(select) =>
			(
				select(coreStore).getEntityRecords('surecart', 'price', {
					context: 'edit',
					product_ids: [product?.id],
					per_page: 100,
				}) || []
			).filter((price) => !price?.archived),
		[product?.id]
	);

	/**
	 * Update a variant by position.
	 */
	const updateVariant = debounce((data, position) => {
		updateProduct({
			variants: product?.variants.map((item) =>
				item?.position !== position ? item : { ...item, ...data }
			),
		});
	}, 500);

	return (
		<div
			css={css`
				sc-table-cell:first-of-type {
					padding-left: 30px;
				}
				sc-table-cell:last-of-type {
					padding-right: 30px;
				}
				.components-card__body {
					padding: 0 !important;
				}
				--sc-table-cell-spacing: var(--sc-spacing-large);
			`}
		>
			<ScTable
				style={{
					'--shadow': 'none',
					'--border-radius': '0',
					borderLeft: '0',
					borderRight: '0',
				}}
			>
				<ScTableCell slot="head" style={{ width: '200px' }}>
					{__('Variant', 'surecart')}
				</ScTableCell>
				<ScTableCell slot="head" style={{ width: '150px' }}>
					{__('Price', 'surecart')}
				</ScTableCell>
				{!!product?.stock_enabled && (
					<ScTableCell slot="head" style={{ width: '150px' }}>
						{__('Quantity', 'surecart')}
					</ScTableCell>
				)}
				<ScTableCell slot="head" style={{ width: '150px' }}>
					{__('Sku', 'surecart')}
				</ScTableCell>
				<ScTableCell slot="head" />

				{(product?.variants ?? [])
					.filter((variant) => 'deleted' !== variant?.status)
					.map((variant, index) => (
						<VariantItem
							key={index}
							variant={variant}
							updateVariant={(data) =>
								updateVariant(data, variant?.position)
							}
							canOverride={(prices || [])?.length <= 1}
							defaultAmount={
								prices?.[0]
									? maybeConvertAmount(
											prices?.[0]?.amount,
											prices?.[0]?.currency || 'usd'
									  )
									: ''
							}
						/>
					))}
			</ScTable>
		</div>
	);
});
