/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect, memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon, ScInput } from '@surecart/components-react';

export default memo(({ option, product, updateProduct, onChangeValue }) => {
	const [values, setValues] = useState(
		option?.values?.length > 0 ? option?.values : [{ index: 1, label: '' }]
	);

	const applySort = (oldIndex, newIndex) => {
		setValues(arrayMove(values, oldIndex, newIndex));
	};

	const onChangeOptionValue = async (index, newLabel) => {
		// update specific option value.
		const updatedOptionValues = values.map((value, valueIndex) =>
			valueIndex === index ? { ...value, label: newLabel } : value
		);

		// Check if the last optionValue has a name, if yes, add a new empty optionValue
		const lastOptionValue =
			updatedOptionValues[updatedOptionValues.length - 1];
		if (lastOptionValue.label !== '') {
			const newOptionValue = {
				index: updatedOptionValues.length + 1,
				label: '',
			};
			updatedOptionValues.push(newOptionValue);
		}
		setValues(updatedOptionValues);
	};

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

		onChangeValue(values);
	}, [values]);

	const deleteOptionValue = (index) => {
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
		<SortableList onSortEnd={applySort}>
			{(values || []).map((optionValue, index) => (
				<SortableItem key={index}>
					<div
						css={css`
							padding-top: var(--sc-spacing-xx-small);
							padding-bottom: var(--sc-spacing-xx-small);
						`}
					>
						<div
							css={css`
								width: 100%;
								display: flex;
								align-items: center;
								gap: 1em;
								justify-content: center;
							`}
						>
							{/* Hide deletebutton for last item */}
							{index !== values.length - 1 ? (
								<ScIcon
									name="drag"
									slot="prefix"
									css={css`
										cursor: grab;
									`}
								/>
							) : (
								<ScIcon name="empty" slot="prefix" />
							)}

							<ScInput
								css={css`
									width: 100%;
									focus: {
										border-color: var(--sc-color-primary);
									}
								`}
								type="text"
								placeholder={__(
									'Add another value',
									'surecart'
								)}
								value={optionValue.label}
								onInput={(e) =>
									onChangeOptionValue(index, e.target.value)
								}
							/>

							{index !== values.length - 1 && (
								<ScButton
									type="text"
									css={css`
										position: absolute;
										right: 0;
										hover: {
											color: var(--sc-color-danger);
										}
									`}
									onClick={() => deleteOptionValue(index)}
								>
									<ScIcon name="trash" slot="suffix" />
								</ScButton>
							)}
						</div>
					</div>
				</SortableItem>
			))}
		</SortableList>
	);
});
