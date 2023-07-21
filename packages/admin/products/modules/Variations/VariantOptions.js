/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScTag } from '@surecart/components-react';
import VariantOptionValues from './VariantOptionValues';
import { generateVariants } from './utils';

export default ({ product, updateProduct, loading }) => {
	// function to update product?.variant_options based on the index.
	const updateVariantOption = (action) => {
		updateProduct({
			...product,
			variant_options: product.variant_options.map((item, index) => {
				if (index !== action.index) {
					return item;
				}
				return {
					...item,
					...action.data,
				};
			}),
		});
	};

	useEffect(() => {
		// removes all variant values, which label is empty.
		let updatedVariantOptions = (
			product?.variant_options?.data ||
			product?.variant_options ||
			[]
		)?.map((variantOption) => {
			return {
				...variantOption,
				values: variantOption?.values?.filter(
					(value) => value?.label?.length > 0
				),
			};
		});

		// Also filter out variant options, which has no values or name.
		updatedVariantOptions = updatedVariantOptions?.filter(
			(variantOption) =>
				variantOption?.values?.length > 0 && variantOption?.name?.length
		);

		const variants = generateVariants(updatedVariantOptions ?? []) ?? [];

		updateProduct({
			...product,
			variants,
		});
	}, [product?.variant_options]);

	return (
		<div style={{ marginBotttom: '2rem' }} loading={loading}>
			{Array.isArray(product?.variant_options) &&
				product?.variant_options.map((option, index) => {
					const values = [
						...new Set(
							Array.from(product?.variants || []).map(
								(obj) => obj[`option_${index + 1}`]
							)
						),
					];
					return (
						<div
							key={index}
							css={css`
								padding-top: var(--sc-spacing-xx-small);
								padding-bottom: var(--sc-spacing-xx-small);
								margin-bottom: var(--sc-spacing-xx-small);
							`}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '1em',
									justifyContent: 'space-between',
									marginBottom: '1em',
									paddingBottom: '1em',
									borderBottom:
										'1px solid var(--sc-color-gray-200)',
								}}
							>
								<div>
									<ScInput
										type="text"
										placeholder={__(
											'Option Name',
											'surecart'
										)}
										required
										label={__('Option Name', 'surecart')}
										value={option?.name}
										onScInput={(e) => {
											updateVariantOption({
												index,
												data: {
													name: e.target.value,
												},
											});
										}}
									/>

									<VariantOptionValues
										option={option}
										product={product}
										updateProduct={updateProduct}
										onChangeValue={(updatedValues) => {
											updateVariantOption({
												index,
												data: {
													values: updatedValues,
												},
											});
										}}
									/>
								</div>
							</div>
						</div>
					);
				})}
		</div>
	);
};
