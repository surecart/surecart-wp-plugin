/**
 * External dependencies.
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { SortableKnob } from 'react-easy-sort';

/**
 * Internal dependencies.
 */
import { ScIcon, ScInput } from '@surecart/components-react';

export default ({
	value,
	values,
	index,
	onChange,
	disabled,
	onDelete,
	required,
	placeholder,
	isDeletable,
	isDraggable,
}) => {
	// handle validation.
	const [customValidity, setCustomValidity] = useState('');

	const handleChange = (changed) => {
		// has duplicate, don't update.
		if (
			!!changed &&
			values.includes(changed) &&
			values[index] !== changed
		) {
			return setCustomValidity(
				sprintf(
					__(
						'You have already used the same option value "%s".',
						'surecart'
					),
					changed
				)
			);
		}

		// else it's valid.
		setCustomValidity('');
		onChange(changed);
	};

	return (
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
					visibility: ${isDraggable ? 'visible' : 'hidden'};
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
				label={sprintf(__('Option Value %d', 'surecart'), index + 1)}
				showLabel={false}
				css={css`
					width: 100%;
					focus: {
						border-color: var(--sc-color-primary);
					}
				`}
				type="text"
				placeholder={
					!disabled
						? placeholder
						: __(
								'You have reached the variant limit of 300',
								'surecart'
						  )
				}
				value={value}
				disabled={disabled}
				required={required}
				onKeyDown={(e) => {
					// if we deleted everything, and the label is already blank, delete this.
					if (e.key === 'Backspace' && !e.target.value) {
						onDelete();
					}
				}}
				onScInput={(e) => {
					e.target.setCustomValidity(customValidity);
					handleChange(e.target.value);
				}}
				onScChange={(e) => {
					e.target.setCustomValidity(customValidity);
				}}
			/>
			<ScIcon
				css={css`
					visibility: ${isDeletable ? 'visible' : 'hidden'};
					cursor: pointer;
					transition: color var(--sc-transition-medium) ease-in-out;
					&:hover {
						color: var(--sc-color-danger-500);
					}
				`}
				tabindex="0"
				onClick={onDelete}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						onDelete();
					}
				}}
				name="trash"
			/>
		</div>
	);
};
