/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
// import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

/**
 * Internal dependencies.
 */
import { hasDuplicate } from './utils';
import VariantOptionValue from './VariantOptionValue';
import { useEffect } from 'react';

export default ({ values, onChange }) => {
	// update specific option value.
	const updateValue = (index, newLabel) => {
		const updated = (values || []).map((value, valueIndex) =>
			valueIndex === index ? newLabel : value
		);
		if (hasDuplicate(updated)) {
			return;
		}
		onChange(updated);
	};

	// sort values
	const applySort = (oldIndex, newIndex) =>
		onChange(arrayMove(values, oldIndex, newIndex));

	// we always want an empty value at the end.
	useEffect(() => {
		const hasEmpty = values.some((value) => !value);
		if (!hasEmpty) {
			onChange([...values, '']);
		}
	}, [values]);

	// remove the option value from the array.
	const deleteOptionValue = (index) => {
		onChange(
			(values || []).filter((_, valueIndex) => valueIndex !== index)
		);
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
						<div>
							<VariantOptionValue
								value={optionValue}
								values={values}
								index={index}
								required={index === 0 || !isLastItem}
								onChange={(value) => updateValue(index, value)}
								// disabled={
								// 	product?.variants?.length > 99 && isLastItem
								// }
								onDelete={() => deleteOptionValue(index)}
								placeholder={
									isLastItem
										? __('Add another value', 'surecart')
										: null
								}
								isDraggable={!isLastItem}
								isDeletable={!isLastItem}
							/>
						</div>
					</SortableItem>
				);
			})}
		</SortableList>
	);
};
