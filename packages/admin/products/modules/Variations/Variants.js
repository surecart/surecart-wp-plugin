/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import VariantItem from './VariantItem';
import { maybeConvertAmount } from '../../../util';
import { TableVirtuoso } from 'react-virtuoso';
import { useCallback } from 'react';

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
	const updateVariant = useCallback((data, position) => {
		updateProduct({
			variants: product?.variants.map((item) =>
				item?.position !== position ? item : { ...item, ...data }
			),
		});
	}, []);

	const activeVariants = (product?.variants ?? []).filter(
		(variant) => 'deleted' !== variant?.status
	);

	return (
		<div
			css={css`
				table {
					width: 100%;
				}
				thead {
					top: 111px !important;
				}

				td {
					font-size: var(--sc-font-size-medium);
					padding: var(
							--sc-table-cell-spacing,
							var(--sc-spacing-small)
						)
						var(--sc-table-cell-spacing, var(--sc-spacing-large)) !important;
					vertical-align: middle;
				}

				tr:not(:last-child) {
					td {
						border-bottom: 1px solid
							var(
								--sc-table-row-border-bottom-color,
								var(--sc-color-gray-200)
							);
					}
				}

				.components-card__body {
					padding: 0 !important;
				}
				--sc-table-cell-spacing: var(--sc-spacing-large);
			`}
		>
			<TableVirtuoso
				data={activeVariants}
				useWindowScroll
				fixedHeaderContent={() => {
					const cell = {
						padding:
							'var(--sc-table-cell-spacing, var(--sc-spacing-small))',
						borderTop: '1px solid var(--sc-color-gray-200);',
						borderBottom: '1px solid var(--sc-color-gray-200)',
						marginBottom: '-1px',
					};
					return (
						<tr
							css={css`
								background: var(
									--sc-table-cell-background-color,
									var(--sc-color-gray-50)
								);
								font-size: var(--sc-font-size-x-small);
								text-transform: uppercase;
								font-weight: var(--sc-font-weight-semibold);
								letter-spacing: var(--sc-letter-spacing-loose);
								color: var(--sc-color-gray-500);
								text-align: left;
								border: 1px solid var(--sc-color-gray-200);
							`}
						>
							<th css={cell} style={{ width: '200px' }}>
								{__('Variant', 'surecart')}
							</th>
							<th css={cell} style={{ width: '150px' }}>
								{__('Price', 'surecart')}
							</th>
							<th css={cell} style={{ width: '150px' }}>
								{__('Quantity', 'surecart')}
							</th>
							<th css={cell} style={{ width: '150px' }}>
								{__('SKU', 'surecart')}
							</th>
							<th css={cell}></th>
						</tr>
					);
				}}
				itemContent={(_, variant) => (
					<VariantItem
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
				)}
			/>
		</div>
	);
});
