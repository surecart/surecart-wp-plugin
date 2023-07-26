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
import { ScButton, ScIcon, ScInput, ScTag } from '@surecart/components-react';
import VariantOptionValues from './VariantOptionValues';
import { checkOptionValueError, generateVariants } from './utils';
import Error from '../../../components/Error';

export default ({ product, updateProduct, loading }) => {
	const [error, setError] = useState(null);
	const [editingValues, setEditingValues] = useState({});

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

	useEffect(() => {
		// removes all variant values, which label is empty and which has no name.
		let updatedVariantOptions = (product?.variant_options ?? [])
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

		const variantsData =
			generateVariants(updatedVariantOptions, product?.variants ?? []) ??
			[];

		updateProduct({
			variants: variantsData,
		});
	}, [product?.variant_options]);

	const renderEditingVariantOption = (option, index) => {
		return (
			<div>
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
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '1em',
						marginTop: '1em',
						marginBottom: '1em',
						paddingBottom: '1em',
						borderBottom: '1px solid var(--sc-color-gray-200)',
					}}
				>
					<div
						style={{
							flex: 1,
						}}
					>
						<label
							css={css`
								display: block;
								margin-left: 1.6rem;
								font-weight: 500;
							`}
						>
							{__('Option Values', 'surecart')}{' '}
							<span style={{ color: 'red' }}>*</span>
						</label>
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
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '1em',
					justifyContent: 'space-between',
					marginBottom: '1em',
					paddingBottom: '1em',
					borderBottom: '1px solid var(--sc-color-gray-200)',
				}}
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
										padding-top: var(--sc-spacing-xx-small);
										padding-bottom: var(
											--sc-spacing-xx-small
										);
										margin-bottom: var(
											--sc-spacing-xx-small
										);
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
