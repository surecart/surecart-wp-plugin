/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScTextarea } from '@surecart/components-react';
import { Button } from '@wordpress/components';

export default function LineItemNoteModal({
	onSave,
	onCancel,
	autoFocus = true,
	initialValue = '',
	busy = false,
}) {
	const [value, setValue] = useState(initialValue);
	const textareaRef = useRef(null);
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		if (textareaRef.current && autoFocus) {
			setTimeout(() => {
				textareaRef.current.triggerFocus();
			}, 0);
		}
	}, []);

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: var(--sc-spacing-small);
				margin-top: var(--sc-spacing-small);
			`}
		>
			<ScTextarea
				value={value}
				ref={textareaRef}
				autofocus={autoFocus}
				placeholder={__('Add a note...', 'surecart')}
				onScInput={(e) => setValue(e.target.value)}
				rows="3"
				css={css`
					font-size: 12px;
				`}
				maxLength={500}
			/>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
				`}
			>
				<Button
					size="small"
					variant="primary"
					onClick={() => onSave(value)}
					isBusy={busy}
				>
					{__('Save', 'surecart')}
				</Button>
				<Button size="small" variant="text" onClick={onCancel}>
					{__('Cancel', 'surecart')}
				</Button>
			</div>
		</div>
	);
}
