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
import {
	ScButton,
	ScProductLineItemNote,
	ScText,
	ScTextarea,
} from '@surecart/components-react';

export default ({ lineItem, onChange, isDraftInvoice }) => {
	const [noteEditing, setNoteEditing] = useState(false);
	const [noteValue, setNoteValue] = useState(lineItem?.note || '');

	useEffect(() => {
		setNoteValue(lineItem?.note || '');
	}, [lineItem?.note]);

	const handleNoteSubmit = () => {
		setNoteEditing(false);
		onChange({ note: noteValue });
	};

	const handleNoteCancel = () => {
		setNoteEditing(false);
		setNoteValue(lineItem?.note || '');
	};

	if (!isDraftInvoice) {
		return <ScProductLineItemNote note={lineItem.note ?? ''} />;
	}

	return (
		<div
			css={css`
				min-height: 2em;
				display: flex;
				align-items: center;
			`}
		>
			{noteEditing ? (
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: 0.5em;
						width: 100%;
					`}
				>
					<ScTextarea
						autofocus
						value={noteValue}
						placeholder={__('Add a note...', 'surecart')}
						onScInput={(e) => setNoteValue(e.target.value)}
						rows="2"
						css={css`
							font-size: 12px;
						`}
					/>
					<div
						css={css`
							display: flex;
							gap: 0.25em;
						`}
					>
						<ScButton
							size="small"
							type="primary"
							onClick={handleNoteSubmit}
						>
							{__('Save', 'surecart')}
						</ScButton>
						<ScButton
							size="small"
							type="text"
							onClick={handleNoteCancel}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</div>
			) : (
				<button
					css={css`
						cursor: pointer;
						width: 100%;
						min-height: 2em;
						display: flex;
						align-items: center;
						padding: 0.25em;
						border-radius: 4px;
						border: none;
						background: transparent;
						text-align: left;
						&:hover {
							background-color: var(--sc-color-gray-50);
						}
						&:focus {
							outline: 2px solid var(--sc-color-primary-500);
							outline-offset: 2px;
						}
					`}
					onClick={() => setNoteEditing(true)}
					aria-label={
						lineItem?.note
							? __('Edit note', 'surecart')
							: __('Add note', 'surecart')
					}
					type="button"
				>
					{lineItem?.note ? (
						<ScText
							css={css`
								font-size: 12px;
								line-height: 1.3;
								color: var(--sc-input-color);
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								overflow: hidden;
								text-overflow: ellipsis;
							`}
						>
							{lineItem.note}
						</ScText>
					) : (
						<ScText
							css={css`
								font-size: 12px;
								color: var(--sc-input-placeholder-color);
								font-style: italic;
							`}
						>
							{__('Add note (optional)', 'surecart')}
						</ScText>
					)}
				</button>
			)}
		</div>
	);
};
