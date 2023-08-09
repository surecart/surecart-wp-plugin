/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScPriceInput,
	ScText,
	ScTooltip,
} from '@surecart/components-react';
import DataTable from '../../../components/DataTable';
import Image from './Image';

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

	/**
	 * On Delete variant, just update the status as draft for that variant.
	 *
	 * @param {object} variant
	 */
	const toggleDelete = async (variant) => {
		const event = {
			target: {
				name: 'status',
				value: variant?.status === 'draft' ? 'publish' : 'draft',
			},
		};
		updateVariantValue(event, product?.variants.indexOf(variant));
	};

	useEffect(() => {
		if (product?.variants?.length > 0) {
			// Get total stock adjustment by summing all variants stock_adjustment
			const totalStockAdjustment = product?.variants.reduce(
				(total, variant) =>
					parseInt(total || 0) +
					(variant.stock_adjustment || variant.stock || 0),
				0
			);

			updateProduct({
				stock: totalStockAdjustment,
			});
		}
	}, [product?.variants]);

	const updateVariantValue = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;

		const allVariants = product?.variants.map((variant, index2) => {
			if (index2 === index) {
				let newVariant = {
					...variant,
					[name]: value,
				};

				if (name === 'stock') {
					newVariant['stock_adjustment'] = parseInt(value);
				}

				return newVariant;
			}
			return variant;
		});

		updateProduct({
			variants: allVariants,
		});
	};

	const renderVariantName = (variant) => {
		const { option_1, option_2, option_3, status } = variant;

		if (status !== 'draft') {
			return (
				<>
					{option_1}
					{option_2?.length > 0 && ' / '} {option_2}
					{option_3?.length > 0 && ' / '} {option_3}
				</>
			);
		} else {
			return (
				<del style={{ color: 'var(--sc-color-gray-400)' }}>
					{option_1}
					{option_2?.length > 0 && ' / '} {option_2}
					{option_3?.length > 0 && ' / '} {option_3}
				</del>
			);
		}
	};

	const onAddMedia = async (media, variant) => {
		const event = {
			target: {
				name: 'image',
				value: media,
			},
		};
		updateVariantValue(event, product?.variants.indexOf(variant));
		createSuccessNotice(__('Variant Image updated.', 'surecart'), {
			type: 'snackbar',
		});
	};

	const onDeleteMedia = async (media, variant) => {
		const confirmDeleteMedia = confirm(
			__(
				'Are you sure you wish to delete this variant image? This cannot be undone.',
				'surecart'
			)
		);
		if (!confirmDeleteMedia) return;

		updateVariantValue(
			{
				target: {
					name: 'image',
					value: null,
				},
			},
			product?.variants.indexOf(variant)
		);
	};

	const renderAmount = (variant, index) => {
		if (prices?.length > 1) {
			return (
				<ScTooltip
					type="text"
					text={__(
						'Product has multiple prices. Please keep only one price to maintain variant wise pricing.',
						'surecart'
					)}
				>
					<ScButton type="warning" size="small">
						{__('Inactive', 'surecart')}
					</ScButton>
				</ScTooltip>
			);
		}

		return (
			<ScPriceInput
				type="number"
				min="0"
				value={variant?.amount}
				currency={product?.currency}
				name="amount"
				disabled={variant?.status === 'draft'}
				onScChange={(e) => updateVariantValue(e, index)}
			/>
		);
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
				const { id, sku, status, image, product, stock } = variant;
				return {
					variant: (
						<ScFlex
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								gap: '1rem',
								justifyContent: 'flex-start',
							}}
						>
							<div
								style={{
									border: '1px dotted var(--sc-color-gray-200)',
									borderRadius: '4px',
									padding: 'var(--sc-spacing-xx-small)',
									cursor: 'pointer',
								}}
							>
								{image ? (
									<div
										css={css`
											position: relative;
											margin-right: 6px;
										`}
									>
										<img
											src={image?.url}
											alt="product image"
											css={css`
												width: 1.5rem;
												height: 1.5rem;
											`}
										/>
										<ScIcon
											name="trash"
											slot="suffix"
											css={css`
												position: absolute;
												right: -14px;
												top: -12px;
												cursor: pointer;
												opacity: 0.8;
												&:hover {
													opacity: 1;
												}
											`}
											onClick={() =>
												onDeleteMedia(image, variant)
											}
										/>
									</div>
								) : (
									<Image
										variant={variant}
										product={product}
										updateProduct={updateProduct}
										disabled={status === 'draft'}
										existingMediaIds={
											image?.length > 0
												? [image?.media?.id]
												: []
										}
										onAddMedia={(medias) =>
											onAddMedia(medias, variant)
										}
									>
										<ScIcon
											name="image"
											style={{
												'--color':
													'var(--sc-color-gray-600)',
											}}
										/>
									</Image>
								)}
							</div>

							<ScText
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
									flex: 1,
								}}
							>
								{renderVariantName(variant)}
							</ScText>
						</ScFlex>
					),
					amount: renderAmount(variant, index),
					stock: (
						<ScInput
							value={stock ?? 0}
							name="stock"
							disabled={status === 'draft'}
							onScChange={(e) => {
								updateVariantValue(e, index);
							}}
						/>
					),
					sku: (
						<ScInput
							value={sku}
							name="sku"
							disabled={status === 'draft'}
							onScChange={(e) => updateVariantValue(e, index)}
						/>
					),
					actions: (
						<ScDropdown placement="bottom-end">
							<ScButton type="text" slot="trigger">
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem
									onClick={() => toggleDelete(variant)}
								>
									{variant?.status === 'draft'
										? __('Restore', 'surecart')
										: __('Delete', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					),
				};
			})}
		></DataTable>
	);
};
