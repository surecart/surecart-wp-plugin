/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect, memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import arrayMove from 'array-move';

/**
 * Internal dependencies.
 */
import { ScIcon, ScInput } from '@surecart/components-react';

export default memo(({ option, product, updateProduct, onChangeValue }) => {
	const [changeType, setChangeType] = useState('option_value_renamed');
	const [values, setValues] = useState(
		option?.values?.length > 0
			? option?.values ?? []
			: [{ index: 1, label: '' }]
	);

	const applySort = (oldIndex, newIndex) => {
		setChangeType('option_value_sorted');

		setValues(arrayMove(values, oldIndex, newIndex));
	};

	const onChangeOptionValue = async (index, newLabel) => {
		setChangeType('option_value_renamed');

		// update specific option value.
		const updatedOptionValues = values.map((value, valueIndex) =>
			valueIndex === index ? { ...value, label: newLabel } : value
		);
		setValues(updatedOptionValues);
	};

	// we always want an empty value at the end.
	useEffect(() => {
		const hasEmpty = values.some((value) => !value?.label);
		if (!hasEmpty) {
			setValues([
				...values,
				{
					label: '',
				},
			]);
		}
	}, [values]);

	// as the values are changed, we need to add in variants.data.
	useEffect(() => {
		updateProduct({
			...product,
			variants: {
				...product.variants,
				data: values
					.filter((value) => !!value?.label)
					.map((value) => {
						return { option_1: value.label };
					}),
			},
		});

		onChangeValue(values, changeType);
	}, [values]);

	const deleteOptionValue = (index) => {
		setChangeType('option_value_deleted');

		const newOptionValues = [...values];
		newOptionValues.splice(index, 1);

		// update the index of the option values.
		const updatedOptionValues = newOptionValues.map((value, valueIndex) => {
			return {
				...value,
				index: valueIndex + 1,
			};
		});
		setValues(updatedOptionValues);
	};

	return (
		<SortableList
			onSortEnd={applySort}
			css={css`
				display: grid;
				gap: 1em;
			`}
		>
			{(values || []).map((optionValue, index, array) => {
				const isLastItem = index === array.length - 1;
				return (
					<SortableItem key={index}>
						<div
							css={css`
								width: 100%;
								display: flex;
								align-items: center;
								gap: 1em;
								justify-content: center;
							`}
						>
							{/* Hide if last item */}
							{isLastItem ? (
								<ScIcon name="empty" slot="prefix" />
							) : (
								<SortableKnob>
									<ScIcon
										name="drag"
										slot="prefix"
										css={css`
											cursor: grab;
										`}
									/>
								</SortableKnob>
							)}

							<ScInput
								css={css`
									width: 100%;
									focus: {
										border-color: var(--sc-color-primary);
									}
								`}
								type="text"
								placeholder={
									isLastItem
										? __('Add another value', 'surecart')
										: null
								}
								value={optionValue.label}
								onKeyDown={(e) => {
									// if we deleted everything, and the label is already blank, delete this.
									if (
										e.key === 'Backspace' &&
										!optionValue.label
									) {
										deleteOptionValue(index); // delete option values
									}
								}}
								onInput={(e) =>
									onChangeOptionValue(index, e.target.value)
								}
							>
								{!isLastItem && (
									<ScIcon
										css={css`
											cursor: pointer;
											transition: color
												var(--sc-transition-medium)
												ease-in-out;
											&:hover {
												color: var(
													--sc-color-danger-500
												);
											}
										`}
										onClick={() => deleteOptionValue(index)}
										slot="suffix"
										name="trash"
									/>
								)}
							</ScInput>
						</div>
					</SortableItem>
				);
			})}
		</SortableList>
	);
});
