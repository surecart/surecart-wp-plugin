/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScIcon, ScProductLineItemNote } from '@surecart/components-react';
import LineItemNoteInput from './LineItemNoteInput';

export default function LineItemNote({
	lineItem,
	onChange,
	isDraftInvoice,
	busy = false,
}) {
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (!busy) {
			setEditing(false);
		}
	}, [busy]);

	if (!isDraftInvoice) {
		return (
			!!lineItem?.note && <ScProductLineItemNote note={lineItem?.note} />
		);
	}

	if (editing) {
		return (
			<LineItemNoteInput
				onSave={(noteValue) => onChange({ note: noteValue })}
				onCancel={() => setEditing(false)}
				initialValue={lineItem?.note ?? ''}
				busy={busy}
				autoFocus={false}
			/>
		);
	}

	return (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 4px;
				cursor: pointer;
				color: var(--sc-input-placeholder-color);
				border-radius: var(--sc-input-border-radius-small);

				&:focus-visible {
					outline: 2px solid var(--sc-color-primary-500);
					outline-offset: 2px;
				}

				sc-icon {
					opacity: 0;
				}

				&:hover {
					cursor: pointer;
					text-decoration: underline;

					sc-icon {
						opacity: 1;
					}
				}
			`}
			onClick={() => setEditing(true)}
			role="button"
			tabIndex={1}
			aria-label={
				lineItem?.note
					? __('Edit note', 'surecart')
					: __('Add note', 'surecart')
			}
		>
			<ScProductLineItemNote
				note={lineItem?.note || __('Add note...', 'surecart')}
				alwaysShowIcon={true}
			>
				<ScIcon
					slot="icon"
					name="edit-3"
					style={{
						width: 14,
						height: 14,
						color: 'var(--sc-color-gray-500)',
					}}
				/>
			</ScProductLineItemNote>
		</div>
	);
}
