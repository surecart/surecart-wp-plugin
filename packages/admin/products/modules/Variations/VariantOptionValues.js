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
import { hasDuplicate } from './utils';

export default memo(({ option, onChangeValue }) => {
	const [values, setValues] = useState(
		option?.values?.length > 0
			? option?.values ?? []
			: [{ index: 1, label: '', id: new Date().valueOf() }]
	);

	const applySort = (oldIndex, newIndex) =>
		setValues(arrayMove(values, oldIndex, newIndex));

	// update specific option value.
	const onChangeOptionValue = (index, newLabel) =>
		setValues(
			values.map((value, valueIndex) =>
				valueIndex === index ? newLabel : value
			)
		);

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
						<div
							css={css`
								width: 100%;
								display: flex;
								align-items: center;
								gap: 1em;
								justify-content: center;
							`}
						>
							<div
								css={css`
									visibility: ${isLastItem
										? 'hidden'
										: 'visible'};
								`}
							>
								<SortableKnob>
									<ScIcon
										name="drag"
										slot="prefix"
										css={css`
											cursor: grab;
										`}
									/>
								</SortableKnob>
							</div>
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
								value={optionValue}
								required={index === 0}
								onKeyDown={(e) => {
									// if we deleted everything, and the label is already blank, delete this.
									if (e.key === 'Backspace' && !optionValue) {
										deleteOptionValue(index); // delete option values
									}
								}}
								onScInput={(e) => {
									e.target.setCustomValidity('');
									onChangeOptionValue(index, e.target.value);
								}}
								onScChange={(e) => {
									// e.target.setCustomValidity(
									// 	hasDuplicate(values, 'label')
									// 		? sprintf(
									// 				__(
									// 					'You have already used the same option value "%s".',
									// 					'surecart'
									// 				),
									// 				e.target.value
									// 		  )
									// 		: ''
									// );
								}}
							/>
							<ScIcon
								css={css`
									visibility: ${isLastItem
										? 'hidden'
										: 'visible'};
									cursor: pointer;
									transition: color
										var(--sc-transition-medium) ease-in-out;
									&:hover {
										color: var(--sc-color-danger-500);
									}
								`}
								onClick={() => deleteOptionValue(index)}
								name="trash"
							/>
						</div>
					</SortableItem>
				);
			})}
		</SortableList>
	);
});
