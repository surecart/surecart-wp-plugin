/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { useEffect, useRef, useState } from '@wordpress/element';
import SortableList, { SortableItem } from 'react-easy-sort';
import { store as coreStore } from '@wordpress/core-data';
import arrayMove from 'array-move';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { generateVariants, normalizeVariants } from './utils';
import Error from '../../../components/Error';
import VariantOption from './VariantOption';
import { useDispatch } from '@wordpress/data';

export default ({ product, updateProduct }) => {
	const [error, setError] = useState(null);
	const firstUpdate = useRef(true);
	const previousOptions = useRef(product?.variant_options ?? []);
	const previousProduct = useRef(product);
	const [normalizedVariants, setNormalizedVariants] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);

	useEffect(() => {
		// has the product saved?
		const hasSaved =
			product?.updated_at !== previousProduct.current?.updated_at;

		let normalized = normalizedVariants || product?.variants || [];

		// on first update, we want to use the normalized variants.
		if (firstUpdate.current || hasSaved) {
			// this is not the first update anymore.
			firstUpdate.current = false;
			// set normalized variants.
			normalized = normalizeVariants(product);
			setNormalizedVariants(normalized);

			receiveEntityRecords('surecart', 'product', {
				...product,
				variants: normalized,
			});
			// this is a hack to fix a race condition with receiving normalized variants.
			setTimeout(() => {
				receiveEntityRecords('surecart', 'product', {
					...product,
					variants: normalized,
				});
			}, 50);
		} else {
			// We don't want to do this on first load since we only want want the server gives us back.
			updateProduct({
				variants: generateVariants(
					product?.variant_options || [],
					previousOptions.current,
					product?.variants || []
				),
			});
			// store the previous variant options for the next update.
			previousOptions.current = product?.variant_options;
		}
	}, [product?.variant_options]);

	useEffect(() => {
		previousProduct.current = product;
	}, [product]);

	// function to update product?.variant_options based on the index.
	const onUpdate = (action) =>
		updateProduct({
			...product,
			variant_options: (product?.variant_options ?? [])
				.map((item, index) =>
					index !== action.index ? item : { ...item, ...action.data }
				)
				.map((option, index) => ({
					...option,
					position: index, // make sure to map position.
				})),
		});

	// delete a variant option based on the index.
	const onDelete = (index) =>
		updateProduct({
			...product,
			variant_options: (product?.variant_options || [])
				.filter((_, itemIndex) => itemIndex !== index)
				.map((option, index) => ({
					...option,
					position: index, // make sure to map position.
				})),
		});

	// Apply drag to reorder the variant options.
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

	// we don't want to render if there are no variant options.
	if (!product?.variant_options?.length) {
		return null;
	}

	return (
		<div
			css={css`
				display: grid;
				gap: 1rem;
				content-visibility: auto;
			`}
		>
			<Error error={error} setError={setError} />
			<SortableList
				onSortEnd={applyDrag}
				draggedItemClassName="sc-dragging"
			>
				{product?.variant_options.map((option, index) => {
					const options = product?.variant_options || [];
					const total =
						(options?.[index - 2]?.values?.filter?.((v) => v)
							?.length || 1) *
						(options?.[index - 1]?.values?.filter?.((v) => v)
							?.length || 1) *
						((options?.[index]?.values?.filter?.((v) => v)
							?.length || 1) +
							1) *
						(options?.[index + 1]?.values?.filter?.((v) => v)
							?.length || 1) *
						(options?.[index + 2]?.values?.filter?.((v) => v)
							.length || 1);
					return (
						<SortableItem key={index}>
							<div class="variant-option">
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
									canAddValue={total < 300}
								/>
							</div>
						</SortableItem>
					);
				})}
			</SortableList>
		</div>
	);
};
