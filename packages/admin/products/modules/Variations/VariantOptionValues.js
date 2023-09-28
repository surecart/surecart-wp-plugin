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
import { hasDuplicate } from './utils';
import VariantOptionValue from './VariantOptionValue';

export default memo(({ option, onChangeValue }) => {
	const [values, setValues] = useState(
		option?.values?.length > 0 ? option?.values ?? [] : ['']
	);

	const applySort = (oldIndex, newIndex) =>
		setValues(arrayMove(values, oldIndex, newIndex));

	// update specific option value.
	const onChangeOptionValue = (index, newLabel) => {
		const updated = values.map((value, valueIndex) =>
			valueIndex === index ? newLabel : value
		);
		if (hasDuplicate(updated)) {
			return;
		}
		setValues(updated);
	};

	useEffect(() => {
		// when values change, update the option.
		onChangeValue(values);

		// we always want an empty value at the end.
		const hasEmpty = values.some((value) => !value);
		if (!hasEmpty) {
			setValues([...values, '']);
		}
	}, [values]);

	// remove the option value from the array.
	const deleteOptionValue = (index) => {
		setValues(values.filter((_, valueIndex) => valueIndex !== index));
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
								onChange={(value) =>
									onChangeOptionValue(index, value)
								}
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
});
