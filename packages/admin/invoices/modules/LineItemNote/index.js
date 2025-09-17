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
	const textStyle = css`
		color: var(--sc-input-placeholder-color);
		border-radius: var(--sc-input-border-radius-small);
		color: var(--sc-price-label-color, var(--sc-input-help-text-color));
		font-size: var(
			--sc-price-label-font-size,
			var(--sc-input-help-text-font-size-medium)
		);
		line-height: var(--sc-line-height-dense);
	`;

	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (!busy) {
			setEditing(false);
		}
	}, [busy]);

	if (!isDraftInvoice) {
		return (
			!!lineItem?.note && (
				<ScProductLineItemNote
					css={textStyle}
					note={lineItem?.display_note}
				/>
			)
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
			className="sc-line-item-note"
			css={css`
				${!lineItem?.note &&
				css`
					opacity: 0;
					transition: opacity 0.2s;
					sc-table-row:hover &,
					sc-table-row:focus-within & {
						opacity: 1;
					}
				`}

				${textStyle}

				display: flex;
				align-items: center;
				gap: 4px;
				cursor: pointer;

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
			<div
				css={css`
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				`}
			>
				{lineItem?.display_note || __('Add note...', 'surecart')}
			</div>
			<ScIcon
				slot="icon"
				name="edit-3"
				css={css`
					width: 14px;
					height: 14px;
					flex: 0 0 14px;
					color: 'var(--sc-color-gray-500)';
				`}
			/>
		</div>
	);
}
