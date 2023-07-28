/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
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
} from '@surecart/components-react';

/**
 * Internal dependencies.
 */
import DataTable from '../../../components/DataTable';
import Image from './Image';

export default ({ product, updateProduct, loading }) => {
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

	const updateVariantValue = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;

		updateProduct({
			variants: product?.variants.map((variant, index2) => {
				if (index2 === index) {
					return {
						...variant,
						[name]: value,
					};
				}
				return variant;
			}),
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
				sku: {
					label: __('SKU', 'surecart'),
					width: '150px',
				},
				actions: {
					label: __('', 'surecart'),
				},
			}}
			items={(product?.variants ?? []).map((variant, index) => {
				const { id, sku, status, image, product, amount } = variant;
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
					amount: (
						<ScPriceInput
							type="number"
							min="0"
							value={amount}
							currency={product?.currency}
							name="amount"
							disabled={status === 'draft'}
							onScChange={(e) => updateVariantValue(e, index)}
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
