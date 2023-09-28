/**
 * External dependencies.
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	generateVariants,
	getDiffingVariants,
	getExlcudedVariants,
} from './utils';
import Error from '../../../components/Error';
import VariantOption from './VariantOption';

export default ({ product, updateProduct }) => {
	const [error, setError] = useState(null);
	const firstUpdate = useRef(true);
	const [deletedVariants, setDeletedVariants] = useState([]);
	const previousOptions = useRef(product?.variant_options ?? []);

	// For first time load, get the diffing variants and save to local storage.
	// useEffect(() => {
	// 	const variantsData =
	// 		generateVariants(product?.variant_options ?? [], []) ?? [];

	// 	const diffingVariants = getDiffingVariants(
	// 		variantsData,
	// 		product?.variants ?? []
	// 	);
	// 	setDeletedVariants(diffingVariants);
	// }, []);

	useEffect(() => {
		// removes all variant option values, which label is empty and which has no name.
		const variantOptions = (product?.variant_options || [])
			.map((option) => {
				return {
					...option,
					values: option?.values?.filter((value) => !!value),
				};
			})
			.filter(
				(option) => option?.values?.length > 0 && option?.name?.length
			);

		// If first time server side loaded
		// then no need to update product.variants.
		if (!firstUpdate.current) {
			// only generate variants if the variant options have changed.
			updateProduct({
				variants: generateVariants(
					variantOptions,
					previousOptions.current,
					product?.variants
				),
			});
		}

		// we have updated.
		previousOptions.current = product?.variant_options;
		firstUpdate.current = false;
	}, [product?.variant_options]);

	// function to update product?.variant_options based on the index.
	const onUpdate = (action) => {
		updateProduct({
			...product,
			variant_options: (product?.variant_options ?? []).map(
				(item, index) =>
					index !== action.index ? item : { ...item, ...action.data }
			),
		});
	};

	const onDelete = (index) => {
		updateProduct({
			...product,
			variant_options: (product?.variant_options || []).filter(
				(_, itemIndex) => itemIndex !== index
			),
		});
	};

	/**
	 * Apply drag to reorder the variant options.
	 */
	const applyDrag = async (oldIndex, newIndex) => {
		updateProduct({
			...product,
			variant_options: arrayMove(
				product?.variant_options ?? [],
				oldIndex,
				newIndex
			).map((option, index) => ({
				...option,
				position: index, // make sure to map position.
			})),
		});
	};

	if (!product?.variant_options?.length) {
		return null;
	}

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
				{product?.variant_options.map((option, index) => {
					return (
						<SortableItem key={index}>
							<div>
								<VariantOption
									product={product}
									updateProduct={updateProduct}
									option={option}
									updateOption={(data) => {
										onUpdate({
											index,
											data,
										});
									}}
									onDelete={() => onDelete(index)}
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
