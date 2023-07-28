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
	ScButton,
	ScFormControl,
	ScFlex,
	ScIcon,
	ScInput,
	ScTag,
} from '@surecart/components-react';
import VariantOptionValues from './VariantOptionValues';
import {
	checkOptionValueError,
	generateVariants,
	getDeletedVariants,
	getDiffingVariants,
	getExlcudedVariants,
	trackDeletedVariants,
} from './utils';
import Error from '../../../components/Error';

export default ({ product, updateProduct, loading }) => {
	const [error, setError] = useState(null);
	const [editingValues, setEditingValues] = useState({});
	const [changeType, setChangeType] = useState('option_value_renamed');

	// function to update product?.variant_options based on the index.
	const updateVariantOption = (action) => {
		updateProduct({
			...product,
			variant_options: (product?.variant_options ?? []).map(
				(item, index) => {
					if (index !== action.index) {
						return item;
					}
					return {
						...item,
						...action.data,
					};
				}
			),
		});
	};

	const applyDrag = async (oldIndex, newIndex) => {
		setChangeType('option_sorted');
		updateProduct({
			...product,
			variant_options: arrayMove(
				product?.variant_options ?? [],
				oldIndex,
				newIndex
			),
		});
	};

	const changeEditingValues = (index, value) => {
		setEditingValues({
			...editingValues,
			[index]: value,
		});
	};

	// For first time load, we need to add all variant options to editingValues.
	useEffect(() => {
		const editingValuesData = {};
		(product?.variant_options ?? []).forEach((_, index) => {
			editingValuesData[index] = false;
		});
		setEditingValues(editingValuesData);
	}, []);

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

		const variantsData = generateVariants(
			updatedVariantOptions,
			product?.variants ?? [],
			changeType
		);

		updateProduct({
			variants: getExlcudedVariants(variantsData, getDeletedVariants()),
		});
	}, [product?.variant_options]);

	const deleteVariantOption = (index) => {
		setChangeType('option_deleted');

		const variantOptions = [...product?.variant_options];
		variantOptions.splice(index, 1);
		updateProduct({
			...product,
			variant_options: variantOptions,
		});
	};

	const renderEditingVariantOption = (option, index) => {
		return (
			<div
				css={css`
					display: grid;
					gap: 24px;
				`}
			>
				<div
					css={css`
						display: flex;
						gap: 1em;
					`}
				>
					<SortableKnob>
						<ScIcon
							name="drag"
							slot="prefix"
							style={{
								cursor: 'grab',
							}}
						/>
					</SortableKnob>
					<ScFlex justifyContent="center" alignItems="center">
						<ScInput
							type="text"
							placeholder={__('Option Name', 'surecart')}
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

						<ScButton
							type="text"
							onClick={() => deleteVariantOption(index)}
						>
							<ScIcon
								name="trash"
								slot="prefix"
								style={{
									marginLeft: '1rem',
									marginTop: '1rem',
								}}
							/>
						</ScButton>
					</ScFlex>
				</div>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<div
						style={{
							flex: 1,
						}}
					>
						<ScFormControl
							css={css`
								margin-left: 1.6rem;
								display: inline-block;
							`}
							label={__('Option Values', 'surecart')}
							required
						/>
						<VariantOptionValues
							option={option}
							product={product}
							updateProduct={updateProduct}
							onChangeValue={(updatedValues, changeTypeValue) => {
								setChangeType(changeTypeValue);
								updateVariantOption({
									index,
									data: {
										values: updatedValues,
									},
								});
							}}
						/>

						<div
							style={{
								marginLeft: '1.6rem',
								marginTop: '1rem',
							}}
						>
							<ScButton
								onClick={() => {
									// Check duplicate validations.
									const duplicateChecker =
										checkOptionValueError(option?.values);
									if (duplicateChecker.hasDuplicate) {
										setError(duplicateChecker.error);
										return;
									}

									// If passed, then change editing mode.
									changeEditingValues(index, false);
								}}
							>
								{__('Done', 'surecart')}
							</ScButton>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderEditedVariantOption = (option, index) => {
		return (
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 1em;
				`}
			>
				<div>
					<div
						style={{
							display: 'flex',
							marginBottom: '1rem',
						}}
					>
						<SortableKnob>
							<ScIcon
								name="drag"
								slot="prefix"
								style={{
									marginRight: '1rem',
									cursor: 'grab',
								}}
							/>
						</SortableKnob>

						<b>{option?.name}</b>
					</div>

					<div>
						{(option?.values || [])
							.filter(
								(optionValue) => optionValue?.label?.length > 0
							)
							.map((value, keyValue) => {
								return (
									<ScTag
										style={{
											marginRight: '0.5em',
											marginLeft:
												keyValue === 0 ? '2em' : '0',
										}}
										type="primary"
										key={keyValue}
									>
										{value?.label}
									</ScTag>
								);
							})}
					</div>
				</div>

				<div>
					<ScButton onClick={() => changeEditingValues(index, true)}>
						{__('Edit', 'surecart')}
					</ScButton>
				</div>
			</div>
		);
	};

	return (
		<div style={{ marginBotttom: '2rem' }} loading={loading}>
			<div
				style={{
					marginBottom: error?.message ? '1rem' : '0',
				}}
			>
				<Error error={error} setError={setError} />
			</div>

			<SortableList onSortEnd={applyDrag}>
				{Array.isArray(product?.variant_options ?? []) &&
					product?.variant_options.map((option, index) => {
						return (
							<SortableItem
								key={`option_${index}`}
								allowDrag={
									typeof editingValues[index] !==
										'undefined' &&
									editingValues[index] === false
								}
							>
								<div
									key={index}
									css={css`
										padding: 24px;
										background: white;
										border-bottom: 1px solid
											var(--sc-color-gray-200);
									`}
								>
									{typeof editingValues[index] ===
										'undefined' ||
									editingValues[index] === true
										? renderEditingVariantOption(
												option,
												index
										  )
										: renderEditedVariantOption(
												option,
												index
										  )}
								</div>
							</SortableItem>
						);
					})}
			</SortableList>
		</div>
	);
};
