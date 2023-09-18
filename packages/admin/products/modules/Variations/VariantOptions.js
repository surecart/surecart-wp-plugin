/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import arrayMove from 'array-move';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	checkOptionValueError,
	generateVariants,
	getDeletedVariants,
	getDiffingVariants,
	getExlcudedVariants,
	trackDeletedVariants,
} from './utils';
import Error from '../../../components/Error';
import VariantOption from './VariantOption';

export default ({ product, updateProduct, loading }) => {
	const [error, setError] = useState(null);

	// function to update product?.variant_options based on the index.
	const updateVariantOption = (action) => {
		updateProduct({
			...product,
			variant_options: (product?.variant_options ?? []).map(
				(item, index) =>
					index !== action.index ? item : { ...item, ...action.data }
			),
		});
	};

	const applyDrag = async (oldIndex, newIndex) => {
		updateProduct({
			...product,
			change_type: 'option_sorted',
			variant_options: arrayMove(
				product?.variant_options ?? [],
				oldIndex,
				newIndex
			),
		});
	};

	// For first time load, get the diffing variants and save to local storage.
	useEffect(() => {
		const variantsData =
			generateVariants(product?.variant_options ?? [], []) ?? [];

		const diffingVariants = getDiffingVariants(
			variantsData,
			product?.variants ?? []
		);
		trackDeletedVariants(diffingVariants);
	}, []);

	useEffect(() => {
		// removes all variant values, which label is empty and which has no name.
		const updatedVariantOptions = (product?.variant_options ?? [])
			?.map((variantOption) => {
				return {
					...variantOption,
					values: variantOption?.values?.filter(
						(value) => value?.label?.length > 0
					),
				};
			})
			.filter(
				(variantOption) =>
					variantOption?.values?.length > 0 &&
					variantOption?.name?.length
			);

		// If first time server side loaded
		// then no need to update product.variants.
		if (product?.change_type !== 'initially_loaded') {
			const variantsData = generateVariants(
				updatedVariantOptions,
				product?.variants ?? [],
				product?.change_type
			);

			updateProduct({
				variants: getExlcudedVariants(
					variantsData,
					getDeletedVariants()
				),
			});
		}
	}, [product?.variant_options]);

	const deleteVariantOption = (index) => {
		updateProduct({
			...product,
			change_type: 'option_deleted',
			variant_options: (product?.variant_options || []).filter(
				(_, itemIndex) => itemIndex !== index
			),
		});
	};

	return (
		<div>
			<Error
				error={error}
				setError={setError}
				style={{
					marginBottom: error?.message ? '1rem' : '0',
				}}
			/>

			<SortableList onSortEnd={applyDrag}>
				{Array.isArray(product?.variant_options) &&
					product?.variant_options.map((option, index) => {
						return (
							<SortableItem key={index}>
								<div>
									<VariantOption
										product={product}
										updateProduct={updateProduct}
										option={option}
										updateOption={(data) => {
											updateVariantOption({
												index,
												data,
											});
										}}
										onDelete={() =>
											deleteVariantOption(index)
										}
										index={index}
									/>
								</div>
							</SortableItem>
						);
					})}
			</SortableList>
		</div>
	);
};
